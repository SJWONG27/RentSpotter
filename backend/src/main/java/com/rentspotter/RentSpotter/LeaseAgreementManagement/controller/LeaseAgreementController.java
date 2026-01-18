package com.rentspotter.RentSpotter.LeaseAgreementManagement.controller;

import com.rentspotter.RentSpotter.LeaseAgreementManagement.model.LeaseAgreementModel;
import com.rentspotter.RentSpotter.LeaseAgreementManagement.model.LeaseAgreementStatus;
import com.rentspotter.RentSpotter.LeaseAgreementManagement.repository.LeaseAgreementRepository;
import com.rentspotter.RentSpotter.LeaseAgreementManagement.service.EmailService;
import com.rentspotter.RentSpotter.LeaseAgreementManagement.service.LeaseAgreementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/lease")
public class LeaseAgreementController {
    @Autowired
    private LeaseAgreementRepository leaseAgreementRepository;

    @Autowired
    private LeaseAgreementService leaseAgreementService;

    @Autowired
    private EmailService emailService;


    // Landlord
    // UC-12 Renew Existing Landlord LeaseAgreementModel Agreement
    @PutMapping("update-lease/{applicationId}")
    public ResponseEntity<?> updateLeaseAgreement(@PathVariable String applicationId, @RequestBody LeaseAgreementModel leaseData){
        Map<String, Object> response = new HashMap<>();

        return leaseAgreementService.updateLease(applicationId, leaseData)
                .map(savedLease -> {
                    response.put("status", "success");
                    response.put("message", "lease updated");
                    response.put("leaseId", savedLease.getId());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("status", "error");
                    response.put("message", "lease is not exist");
                    return ResponseEntity.ok(response);
                });
    }

    // UC-13 View Lease Agreement Status
    @GetMapping("/status/{leaseId}")
    public ResponseEntity<?> getLeaseStatus(@PathVariable String leaseId){
        return leaseAgreementRepository.findById(leaseId).map(lease->{
                    Map<String, Object> response = new HashMap<>();
                    response.put("status", "success");
                    response.put("leaseId", lease.getId());
                    response.put("leaseStatus", lease.getLeaseStatus());

                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, Object> error = new HashMap<>();
                    error.put("status", "error");
                    error.put("message", "getLeaseStatus not found");
                    return ResponseEntity.status(404).body(error);
                });
    }

    // UC-14 Submit Landlord LeaseAgreementModel Agreement (Create or Update)
    @PostMapping("/submit-landlord/{applicationId}")
    public ResponseEntity<?> submitLandlordLease(@PathVariable String applicationId, @RequestBody LeaseAgreementModel leaseData) {
        Map<String, Object> response = new HashMap<>();

        return leaseAgreementService.submitLandlordLease(applicationId, leaseData)
                .map(savedLease -> {
                    response.put("status", "success");
                    response.put("leaseAgreementId", savedLease.getId());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("status", "error");
                    response.put("message", "lease existed");
                    return ResponseEntity.ok(response);
                });
    }


    @PutMapping("/save-pdf/{leaseId}")
    public ResponseEntity<?> savePdf(@PathVariable String leaseId, @RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        return leaseAgreementService.savePdf(
                leaseId,
                body.get("pdfBase64")
        ).map(lease -> {
            response.put("status", "success");
            response.put("message", "pdf saved succesfully");
            return ResponseEntity.ok(response);
        }).orElseGet(()->{
            response.put("status", "error");
            response.put("message", "pdf unable to be saved");
            return ResponseEntity.ok(response);
        });
    }


    // Tenant
    // UC-15 View Lease Agreement
    @GetMapping("/tenant/{userId}")
    public ResponseEntity<?> getLeases(@PathVariable String userId) {
        return ResponseEntity.ok(leaseAgreementRepository.findByTenantIdOrderByDayDesc(userId));
    }

    // UC-16 Get PDF
    @GetMapping("/get-pdf/{leaseId}")
    public ResponseEntity<?> getPdf(@PathVariable String leaseId) {
        return leaseAgreementRepository.findById(leaseId).map(lease -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("url", "data:application/pdf;base64," + lease.getPdf());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("status", "error");
                    error.put("message", "get pdf not found");
                    return ResponseEntity.status(404).body(error);
                });
    }

    // UC-17 Submit Tenant LeaseAgreementModel Agreement (Finalize)
    @PutMapping("/submit-tenant/{leaseId}")
    public ResponseEntity<?> submitTenantLease(@PathVariable String leaseId, @RequestBody Map<String, String> body) {
        return leaseAgreementService.submitTenantLease(
                        leaseId,
                        body.get("lesseeIc"),
                        body.get("lesseeDesignation"),
                        body.get("lesseeSignature")
                )
                .map(lease -> {
                    Map<String, String> response = new HashMap<>();
                    response.put("status", "success");
                    response.put("message", "LeaseAgreementModel Agreement completed");
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("status", "error");
                    error.put("message", "LeaseAgreementModel not found");
                    return ResponseEntity.status(404).body(error);
                });
    }

    // UC-18 Notify landlord after tenant signed
    @PostMapping("/sendEmail/{recipient_email}")
    public String notifyLandlord(@PathVariable("recipient_email") String recipientEmail){
        String subject = "RentSpotter Notification";

        String body = "Hi there,\n\n"
                + "Lease agreement with (" + recipientEmail + ") was signed by tenant. "
                + "Please proceed with the next step. \n\n"
                + "Best regards,\n"
                + "The AcadProBot Team";

        emailService.sendEmail(recipientEmail, subject, body);
        return "Reset Email Sent";
    }
}
