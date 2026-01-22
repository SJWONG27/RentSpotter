package com.rentspotter.RentSpotter.ReviewApplicantManagement.controller;

import com.rentspotter.RentSpotter.ReviewApplicantManagement.model.ApplicantReview;
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

    @GetMapping("/")
    public ResponseEntity<?> getApplications(
            @RequestParam String landlordId,
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

    @PostMapping("/review")
    public ResponseEntity<?> reviewApplication(@RequestBody Map<String, Object> payload) {
        try {
            String applicationId = (String) payload.get("applicationId");
            String landlordId = (String) payload.get("landlordId");
            String decisionStr = (String) payload.get("decision");
            String feedback = (String) payload.get("feedback");

            ApplicantReview.ReviewDecision decision = ApplicantReview.ReviewDecision.valueOf(decisionStr);

            ApplicantReview review = reviewApplicantService.reviewApplication(applicationId, landlordId, decision,
                    feedback);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error reviewing application: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getReviewHistory(@RequestParam String landlordId) {
        try {
            List<ApplicantReview> history = reviewApplicantService.getReviewHistory(landlordId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching review history: " + e.getMessage());
        }
    }

    @PostMapping("/contact")
    public ResponseEntity<?> contactApplicant(@RequestBody Map<String, String> payload) {
        try {
            String applicationId = payload.get("applicationId");
            String message = payload.get("message");
            reviewApplicantService.contactApplicant(applicationId, message);
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending email: " + e.getMessage());
        }
    }
}
