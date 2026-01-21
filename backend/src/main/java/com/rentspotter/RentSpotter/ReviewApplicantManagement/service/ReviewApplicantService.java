package com.rentspotter.RentSpotter.ReviewApplicantManagement.service;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.service.PropertyManager;
import com.rentspotter.RentSpotter.ReviewApplicantManagement.model.ApplicantReview;
import com.rentspotter.RentSpotter.ReviewApplicantManagement.repository.ApplicantReviewRepository;
import com.rentspotter.RentSpotter.TenantApplication.model.Application;
import com.rentspotter.RentSpotter.TenantApplication.repository.TenantApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewApplicantService {

    @Autowired
    private ApplicantReviewRepository applicantReviewRepository;

    @Autowired
    private TenantApplicationRepository tenantApplicationRepository;

    @Autowired
    private PropertyManager propertyManager;

    public List<Application> getApplicationsForLandlord(String landlordId) {
        // Get all properties for this landlord
        // Note: PropertyRepository has findByLandlordId, but the requirement said inject PropertyManager
        // Since PropertyManager doesn't have findByLandlordId, I'll have to get all and filter or use repository if available.
        // Actually, PropertyRepository is available in the project. 
        // But the requirement specifically asked to inject PropertyManager.
        // Let's see if I can use PropertyRepository too or if I should stick strictly to requested injections.
        // I will use PropertyManager to get all and filter if necessary, or just use what's available.
        // Re-reading: "Inject: ApplicantReviewRepository, TenantApplicationRepository, PropertyManager"
        
        List<Property> allProperties = propertyManager.getAllAvailableProperties();
        List<String> landlordPropertyIds = allProperties.stream()
                .filter(p -> landlordId.equals(p.getLandlordId()))
                .map(Property::getId)
                .collect(Collectors.toList());

        return tenantApplicationRepository.findAll().stream()
                .filter(a -> landlordPropertyIds.contains(a.getPropertyId()))
                .collect(Collectors.toList());
    }

    public ApplicantReview reviewApplication(String applicationId, String landlordId, ApplicantReview.ReviewDecision decision, String feedback) {
        Application application = tenantApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Property property = propertyManager.getPropertyDetails(application.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (!landlordId.equals(property.getLandlordId())) {
            throw new RuntimeException("Unauthorized: Landlord does not own this property");
        }

        // Update application status
        if (decision == ApplicantReview.ReviewDecision.APPROVED) {
            application.setStatus(Application.ApplicationStatus.APPROVED);
        } else {
            application.setStatus(Application.ApplicationStatus.REJECTED);
        }
        tenantApplicationRepository.save(application);

        // Create and save review
        ApplicantReview review = new ApplicantReview(
                applicationId,
                landlordId,
                application.getTenantId(),
                application.getPropertyId(),
                decision,
                feedback
        );

        return applicantReviewRepository.save(review);
    }

    public List<ApplicantReview> getReviewHistory(String landlordId) {
        return applicantReviewRepository.findByLandlordId(landlordId);
    }
}
