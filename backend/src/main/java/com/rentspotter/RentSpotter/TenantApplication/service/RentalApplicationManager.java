package com.rentspotter.RentSpotter.TenantApplication.service;

import com.rentspotter.RentSpotter.TenantApplication.model.Application;
import com.rentspotter.RentSpotter.TenantApplication.repository.ApplicationDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RentalApplicationManager {

    @Autowired
    private ApplicationDAO applicationDAO;

    public Application submitApplication(String tenantId, String propertyId, Double monthlyIncome, String occupation, String message) {
        Application application = new Application(tenantId, propertyId, monthlyIncome, occupation, message);
        return applicationDAO.save(application);
    }

    public List<Application> getTenantApplications(String tenantId) {
        return applicationDAO.findByTenantId(tenantId);
    }

    public Application cancelApplication(String applicationId, String tenantId) {
        Optional<Application> appOpt = applicationDAO.findById(applicationId);
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
        return applicationDAO.save(app);
    }

    public void deleteApplication(String applicationId, String tenantId) {
        Optional<Application> appOpt = applicationDAO.findById(applicationId);
        if (appOpt.isPresent()) {
            Application app = appOpt.get();
            if (!app.getTenantId().equals(tenantId)) {
                 throw new RuntimeException("Unauthorized");
            }
            if (app.getStatus() == Application.ApplicationStatus.REJECTED) {
                applicationDAO.delete(app);
            } else {
                throw new RuntimeException("Only rejected applications can be removed from history");
            }
        }
    }
}
