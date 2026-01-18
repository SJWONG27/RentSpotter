package com.rentspotter.RentSpotter.LeaseAgreementManagement.service;

import com.rentspotter.RentSpotter.LeaseAgreementManagement.model.LeaseAgreementModel;
import com.rentspotter.RentSpotter.LeaseAgreementManagement.model.LeaseAgreementStatus;
import com.rentspotter.RentSpotter.LeaseAgreementManagement.repository.LeaseAgreementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LeaseAgreementService {

    @Autowired
    private LeaseAgreementRepository leaseAgreementRepository;

    // UC-12 Update existing lease
    public Optional<LeaseAgreementModel> updateLease(String applicationId, LeaseAgreementModel leaseData) {
        Optional<LeaseAgreementModel> existingLease =
                leaseAgreementRepository.findByApplicationId(applicationId);

        if (existingLease.isEmpty()) {
            return Optional.empty();
        }

        LeaseAgreementModel lease = existingLease.get();
        updateLeaseFields(lease, leaseData);
        lease.setLeaseStatus(LeaseAgreementStatus.UNDER_REVIEW_BY_TENANT);

        return Optional.of(leaseAgreementRepository.save(lease));
    }

    // UC-14 Submit landlord lease
    public Optional<LeaseAgreementModel> submitLandlordLease(
            String applicationId,
            LeaseAgreementModel leaseData
    ) {
        if (leaseAgreementRepository.findByApplicationId(applicationId).isPresent()) {
            return Optional.empty();
        }

        leaseData.setApplicationId(applicationId);
        leaseData.setLeaseStatus(LeaseAgreementStatus.UNDER_REVIEW_BY_TENANT);
        return Optional.of(leaseAgreementRepository.save(leaseData));
    }

    // UC-17 Submit tenant lease (finalize)
    public Optional<LeaseAgreementModel> submitTenantLease(
            String leaseId,
            String lesseeIc,
            String lesseeDesignation,
            String lesseeSignature
    ) {
        return leaseAgreementRepository.findById(leaseId).map(lease -> {
            lease.setLesseeIc(lesseeIc);
            lease.setLesseeDesignation(lesseeDesignation);
            lease.setLesseeSignature(lesseeSignature);
            lease.setLeaseStatus(LeaseAgreementStatus.EFFECTIVE);
            return leaseAgreementRepository.save(lease);
        });
    }

    // Save PDF
    public Optional<LeaseAgreementModel> savePdf(String leaseId, String pdfBase64) {
        return leaseAgreementRepository.findById(leaseId).map(lease -> {
            lease.setPdf(pdfBase64);
            return leaseAgreementRepository.save(lease);
        });
    }

    private void updateLeaseFields(LeaseAgreementModel target, LeaseAgreementModel source) {
        target.setDay(source.getDay());
        target.setMonth(source.getMonth());
        target.setYear(source.getYear());
        target.setRentRmNum(source.getRentRmNum());
    }
}
