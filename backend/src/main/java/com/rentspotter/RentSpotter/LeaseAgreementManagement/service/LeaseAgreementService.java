package com.rentspotter.RentSpotter.LeaseAgreementManagement.service;

import com.rentspotter.RentSpotter.LeaseAgreementManagement.model.LeaseAgreement;
import com.rentspotter.RentSpotter.LeaseAgreementManagement.repository.LeaseAgreementRepository;
import com.rentspotter.RentSpotter.PropertyApplication.model.PropertyApplication;
import com.rentspotter.RentSpotter.PropertyApplication.service.PropertyApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LeaseAgreementService {
    @Autowired
    private LeaseAgreementRepository leaseAgreementRepository;

    @Autowired
    private PropertyApplicationService applicationService;

    @Autowired
    private com.rentspotter.RentSpotter.Authentication.service.UserService userService;

    public LeaseAgreement submitLandlordAgreement(String applicationId, LeaseAgreement agreement) {
        PropertyApplication application = applicationService.getApplicationById(applicationId);
        if (application == null) return null;

        agreement.setApplicationId(applicationId);
        agreement.setTenantId(application.getTenantId());
        agreement.setLandlordId(application.getLandlordId());
        agreement.setPropertyId(application.getPropertyId());
        agreement.setLeaseStatus("Pending");
        agreement.setCompleted(false);

        LeaseAgreement saved = leaseAgreementRepository.save(agreement);

        // Update application status to Approved when lease is sent
        applicationService.updateStatus(applicationId, "Approved");

        return saved;
    }

    public List<LeaseAgreement> getLeaseAgreementsByTenantId(String tenantId) {
        return leaseAgreementRepository.findByTenantId(tenantId);
    }

    public List<LeaseAgreement> getLeaseAgreementsByUsername(String username) {
        var user = userService.getUserByUsername(username);
        if (user == null) return List.of();
        return getLeaseAgreementsByTenantId(user.getId());
    }
}
