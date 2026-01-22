package com.rentspotter.RentSpotter.TenantApplication.service;

import com.rentspotter.RentSpotter.TenantApplication.model.Application;
import com.rentspotter.RentSpotter.TenantApplication.repository.TenantApplicationRepository;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.service.PropertyManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TenantApplicationService {

    @Autowired
    private TenantApplicationRepository tenantApplicationRepository;

    @Autowired
    private PropertyManager propertyManager;

    public Application submitApplication(String tenantId, String propertyId, Double monthlyIncome, String occupation, String message) {
        if (tenantId == null || tenantId.trim().isEmpty()) {
            throw new IllegalArgumentException("Tenant ID cannot be empty");
        }
        if (propertyId == null || propertyId.trim().isEmpty()) {
            throw new IllegalArgumentException("Property ID cannot be empty");
        }
        
        // Property Existence Check
        if (propertyManager.getPropertyDetails(propertyId).isEmpty()) {
             throw new IllegalArgumentException("Property not found");
        }

        if (monthlyIncome == null || monthlyIncome <= 0) {
            throw new IllegalArgumentException("Monthly income must be greater than 0");
        }
        if (occupation == null || occupation.trim().isEmpty()) {
            throw new IllegalArgumentException("Occupation cannot be empty");
        }
        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("Message cannot be empty");
        }

        // Duplicate Application Check (UC-3)
        List<Application> existingApps = tenantApplicationRepository.findByTenantId(tenantId);
        boolean hasPending = existingApps.stream()
                .anyMatch(app -> app.getPropertyId().equals(propertyId) && app.getStatus() == Application.ApplicationStatus.PENDING);
        
        if (hasPending) {
             throw new IllegalArgumentException("You already have a pending application for this property.");
        }

        Application application = new Application(tenantId, propertyId, monthlyIncome, occupation, message);
        return tenantApplicationRepository.save(application);
    }

    public List<Application> getTenantApplications(String tenantId) {
        return tenantApplicationRepository.findByTenantId(tenantId);
    }

    public Application cancelApplication(String applicationId, String tenantId) {
        Optional<Application> appOpt = tenantApplicationRepository.findById(applicationId);
        if (appOpt.isEmpty()) {
            throw new RuntimeException("Application not found");
        }
        Application app = appOpt.get();
        if (!app.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized");
        }
        if (app.getStatus() != Application.ApplicationStatus.PENDING) {
            throw new RuntimeException("Cannot cancel non-pending application");
        }
        
        app.setStatus(Application.ApplicationStatus.CANCELLED);
        return tenantApplicationRepository.save(app);
    }

    public void deleteApplication(String applicationId, String tenantId) {
        Optional<Application> appOpt = tenantApplicationRepository.findById(applicationId);
        if (appOpt.isPresent()) {
            Application app = appOpt.get();
            if (!app.getTenantId().equals(tenantId)) {
                 throw new RuntimeException("Unauthorized");
            }
            if (app.getStatus() == Application.ApplicationStatus.REJECTED) {
                tenantApplicationRepository.delete(app);
            } else {
                throw new RuntimeException("Only rejected applications can be removed from history");
            }
        }
    }
}
