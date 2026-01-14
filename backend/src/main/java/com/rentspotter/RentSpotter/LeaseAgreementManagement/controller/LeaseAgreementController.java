package com.rentspotter.RentSpotter.LeaseAgreementManagement.controller;

import com.rentspotter.RentSpotter.LeaseAgreementManagement.model.LeaseAgreement;
import com.rentspotter.RentSpotter.LeaseAgreementManagement.service.LeaseAgreementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LeaseAgreementController {
    @Autowired
    private LeaseAgreementService leaseAgreementService;

    @PostMapping("/leaseAgreement/submitLandlordLeaseAgreement/{applicationId}")
    public ResponseEntity<?> submitLandlordLeaseAgreement(@PathVariable String applicationId, @RequestBody LeaseAgreement agreement) {
        LeaseAgreement saved = leaseAgreementService.submitLandlordAgreement(applicationId, agreement);
        if (saved == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(Map.of("leaseAgreementId", saved.getId()));
    }

    @GetMapping("/leaseAgreement/getLeaseAgreements/{tenantId}")
    public ResponseEntity<List<LeaseAgreement>> getLeaseAgreements(@PathVariable String tenantId) {
        return ResponseEntity.ok(leaseAgreementService.getLeaseAgreementsByTenantId(tenantId));
    }

    @GetMapping("/leases/tenant/{username}")
    public ResponseEntity<List<LeaseAgreement>> getLeaseAgreementsByUsername(@PathVariable String username) {
        return ResponseEntity.ok(leaseAgreementService.getLeaseAgreementsByUsername(username));
    }
}
