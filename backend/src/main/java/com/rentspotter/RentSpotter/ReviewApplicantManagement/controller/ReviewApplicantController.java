package com.rentspotter.RentSpotter.ReviewApplicantManagement.controller;

import com.rentspotter.RentSpotter.ReviewApplicantManagement.service.ReviewApplicantService;
import com.rentspotter.RentSpotter.TenantApplication.model.Application;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/landlord/applicants")
public class ReviewApplicantController {

    @Autowired
    private ReviewApplicantService reviewApplicantService;

    @GetMapping("/{landlordId}")
    public ResponseEntity<?> getApplications(
            @PathVariable String landlordId,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String order) {
        try {
            List<Application> applications;
            if ("rating".equalsIgnoreCase(sortBy)) {
                applications = reviewApplicantService.getApplicationsForLandlordSorted(landlordId, order);
            } else {
                applications = reviewApplicantService.getApplicationsForLandlord(landlordId);
            }
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching applications: " + e.getMessage());
        }
    }

    @GetMapping("/applicant-info/{tenantId}")
    public ResponseEntity<?> getApplicantInfo(@PathVariable String tenantId) {
        try {
            return ResponseEntity.ok(reviewApplicantService.getApplicantDetails(tenantId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching applicant info: " + e.getMessage());
        }
    }

    @GetMapping("/feedback/{landlordId}")
    public ResponseEntity<?> getLandlordFeedback(@PathVariable String landlordId) {
        try {
            return ResponseEntity.ok(reviewApplicantService.getLandlordFeedbackHistory(landlordId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching landlord feedback: " + e.getMessage());
        }
    }

    @PutMapping("/accept/{applicationId}")
    public ResponseEntity<?> acceptApplicant(@PathVariable String applicationId,
            @RequestBody Map<String, String> payload) {
        try {
            String landlordId = payload.get("landlordId");
            if (landlordId == null || landlordId.isEmpty()) {
                return ResponseEntity.badRequest().body("landlordId is required");
            }
            String feedback = payload.get("feedback"); // Optional
            reviewApplicantService.acceptApplication(applicationId, landlordId, feedback);
            return ResponseEntity.ok("Application Accepted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error accepting application: " + e.getMessage());
        }
    }

    @PutMapping("/reject/{applicationId}")
    public ResponseEntity<?> rejectApplicant(@PathVariable String applicationId,
            @RequestBody Map<String, String> payload) {
        try {
            String landlordId = payload.get("landlordId");
            if (landlordId == null || landlordId.isEmpty()) {
                return ResponseEntity.badRequest().body("landlordId is required");
            }
            String feedback = payload.get("feedback"); // Optional
            reviewApplicantService.rejectApplication(applicationId, landlordId, feedback);
            return ResponseEntity.ok("Application Rejected");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error rejecting application: " + e.getMessage());
        }
    }

    @PostMapping("/contact/{applicationId}")
    public ResponseEntity<?> contactApplicant(@PathVariable String applicationId,
            @RequestBody Map<String, String> payload) {
        try {
            String message = payload.get("message");
            reviewApplicantService.contactApplicant(applicationId, message);
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending email: " + e.getMessage());
        }
    }
}
