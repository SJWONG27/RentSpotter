package com.rentspotter.RentSpotter.ReviewApplicantManagement.service;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.service.PropertyManager;
import com.rentspotter.RentSpotter.TenantApplication.model.Application;
import com.rentspotter.RentSpotter.TenantApplication.repository.TenantApplicationRepository;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.Rating;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.repository.RatingRepository;
import com.rentspotter.RentSpotter.ReviewApplicantManagement.model.ApplicantReview;
import com.rentspotter.RentSpotter.ReviewApplicantManagement.repository.ApplicantReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.Comparator;

@Service
public class ReviewApplicantService {
    @Autowired
    private ApplicantReviewRepository applicantReviewRepository;

    @Autowired
    private TenantApplicationRepository tenantApplicationRepository;

    @Autowired
    private PropertyManager propertyManager;

    @Autowired
    private RatingRepository ratingRepository;

    public List<Map<String, Object>> getApplicationsForLandlord(String landlordId) {
        List<Property> allProperties = propertyManager.getAllAvailableProperties();
        List<String> landlordPropertyIds = allProperties.stream()
                .filter(p -> landlordId.equals(p.getLandlordId()))
                .map(Property::getId)
                .collect(Collectors.toList());

        List<Application> applications = tenantApplicationRepository.findAll().stream()
                .filter(a -> landlordPropertyIds.contains(a.getPropertyId()))
                .collect(Collectors.toList());

        return enrichApplications(applications);
    }

    public List<Map<String, Object>> getApplicationsForLandlordSorted(String landlordId, String sortOrder) {
        List<Map<String, Object>> enrichedList = getApplicationsForLandlord(landlordId);

        Comparator<Map<String, Object>> comparator = Comparator.comparingDouble(
                app -> (Double) app.getOrDefault("tenantRating", 0.0));

        if ("desc".equalsIgnoreCase(sortOrder)) {
            comparator = comparator.reversed();
        }

        return enrichedList.stream()
                .sorted(comparator)
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> enrichApplications(List<Application> applications) {
        return applications.stream().map(app -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", app.getId());
            map.put("tenantId", app.getTenantId());
            map.put("propertyId", app.getPropertyId());
            map.put("status", app.getStatus());
            map.put("applicationDate", app.getApplicationDate());
            map.put("monthlyIncome", app.getMonthlyIncome());
            map.put("occupation", app.getOccupation());
            map.put("message", app.getMessage());

            // Enrich with User info
            try {
                com.rentspotter.RentSpotter.Authentication.model.User tenant = userRepository
                        .findById(app.getTenantId())
                        .orElse(null);
                if (tenant != null) {
                    map.put("applicantName", tenant.getUsername()); // Or tenant.getFullname() if preferred
                } else {
                    map.put("applicantName", "Unknown");
                }
            } catch (Exception e) {
                map.put("applicantName", "Error");
            }

            // Enrich with Rating info
            List<Rating> ratings = ratingRepository.findByRatedUserId(app.getTenantId());
            double avgRating = ratings.stream()
                    .mapToInt(Rating::getScore)
                    .average()
                    .orElse(0.0);
            map.put("tenantRating", avgRating);

            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getApplicantDetails(String tenantId) {
        com.rentspotter.RentSpotter.Authentication.model.User tenant = userRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        List<Rating> ratings = ratingRepository.findByRatedUserId(tenantId);

        Map<String, Object> details = new HashMap<>();
        details.put("tenant", tenant);
        details.put("ratings", ratings);

        return details;
    }

    public List<ApplicantReview> getLandlordFeedbackHistory(String landlordId) {
        return applicantReviewRepository.findByLandlordId(landlordId);
    }

    public void acceptApplication(String applicationId, String landlordId, String feedback) {
        processApplicationDecision(applicationId, landlordId, ApplicantReview.ReviewDecision.APPROVED, feedback);
    }

    public void rejectApplication(String applicationId, String landlordId, String feedback) {
        processApplicationDecision(applicationId, landlordId, ApplicantReview.ReviewDecision.REJECTED, feedback);
    }

    private void processApplicationDecision(String applicationId, String landlordId,
            ApplicantReview.ReviewDecision decision, String feedback) {
        Application application = tenantApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Property property = propertyManager.getPropertyDetails(application.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        // Optional: Verify landlord owns the property
        if (!landlordId.equals(property.getLandlordId())) {
            throw new RuntimeException("Unauthorized: Landlord does not own this property");
        }

        // Update Status
        if (decision == ApplicantReview.ReviewDecision.APPROVED) {
            application.setStatus(Application.ApplicationStatus.APPROVED);
        } else {
            application.setStatus(Application.ApplicationStatus.REJECTED);
        }
        tenantApplicationRepository.save(application);

        // Save Review
        ApplicantReview review = new ApplicantReview(
                applicationId,
                landlordId,
                application.getTenantId(),
                application.getPropertyId(),
                decision,
                feedback);
        applicantReviewRepository.save(review);
    }

    @Autowired
    private org.springframework.mail.javamail.JavaMailSender mailSender;

    @Autowired
    private com.rentspotter.RentSpotter.Authentication.repository.UserRepository userRepository;

    public void contactApplicant(String applicationId, String message) {
        Application application = tenantApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        com.rentspotter.RentSpotter.Authentication.model.User tenant = userRepository
                .findById(application.getTenantId())
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        if (tenant.getEmail() == null || tenant.getEmail().isEmpty()) {
            throw new RuntimeException("Tenant does not have an email address");
        }

        org.springframework.mail.SimpleMailMessage email = new org.springframework.mail.SimpleMailMessage();
        email.setTo(tenant.getEmail());
        email.setSubject("Update on your Rental Application");
        email.setText(message);

        mailSender.send(email);
    }
}
