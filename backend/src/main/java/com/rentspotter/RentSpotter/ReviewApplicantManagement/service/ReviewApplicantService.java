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

    public List<Application> getApplicationsForLandlord(String landlordId) {
        // Get all properties for this landlord
        // Note: PropertyRepository has findByLandlordId, but the requirement said
        // inject PropertyManager
        // Since PropertyManager doesn't have findByLandlordId, I'll have to get all and
        // filter or use repository if available.
        // Actually, PropertyRepository is available in the project.
        // But the requirement specifically asked to inject PropertyManager.
        // Let's see if I can use PropertyRepository too or if I should stick strictly
        // to requested injections.
        // I will use PropertyManager to get all and filter if necessary, or just use
        // what's available.
        // Re-reading: "Inject: ApplicantReviewRepository, TenantApplicationRepository,
        // PropertyManager"

        List<Property> allProperties = propertyManager.getAllAvailableProperties();
        List<String> landlordPropertyIds = allProperties.stream()
                .filter(p -> landlordId.equals(p.getLandlordId()))
                .map(Property::getId)
                .collect(Collectors.toList());

        return tenantApplicationRepository.findAll().stream()
                .filter(a -> landlordPropertyIds.contains(a.getPropertyId()))
                .collect(Collectors.toList());
    }

    public List<Application> getApplicationsForLandlordSorted(String landlordId, String sortOrder) {
        List<Application> applications = getApplicationsForLandlord(landlordId);

        // Calculate average rating for each tenant from the ratings collection
        Map<String, Double> tenantRatings = new HashMap<>();
        for (Application app : applications) {
            String tenantId = app.getTenantId();
            if (!tenantRatings.containsKey(tenantId)) {
                // Get all ratings for this tenant from the ratings collection
                List<Rating> ratings = ratingRepository.findByRatedUserId(tenantId);

                double avgRating = ratings.stream()
                        .mapToInt(Rating::getScore)
                        .average()
                        .orElse(0.0);
                tenantRatings.put(tenantId, avgRating);
            }
        }

        // Sort applications by tenant rating
        Comparator<Application> comparator = Comparator.comparingDouble(
                app -> tenantRatings.getOrDefault(app.getTenantId(), 0.0));

        if ("desc".equalsIgnoreCase(sortOrder)) {
            comparator = comparator.reversed(); // Highest to Lowest
        }
        // else "asc" = Lowest to Highest (default)

        return applications.stream()
                .sorted(comparator)
                .collect(Collectors.toList());
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
