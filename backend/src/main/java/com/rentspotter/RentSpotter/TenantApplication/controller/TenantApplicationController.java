package com.rentspotter.RentSpotter.TenantApplication.controller;

import com.rentspotter.RentSpotter.TenantApplication.model.Application;
import com.rentspotter.RentSpotter.TenantApplication.service.RentalApplicationManager;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.service.PropertyManager;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tenant/applications")
public class TenantApplicationController {

    @Autowired
    private RentalApplicationManager rentalApplicationManager;
    
    @Autowired
    private PropertyManager propertyManager; // To validate property availability before applying

    // UC-3: Submit rental application
    @PostMapping
    public ResponseEntity<?> applyForProperty(@RequestBody Map<String, Object> payload) {
        try {
            String tenantId = (String) payload.get("tenantId");
            String propertyId = (String) payload.get("propertyId");
            Double monthlyIncome = Double.valueOf(payload.get("monthlyIncome").toString());
            String occupation = (String) payload.get("occupation");
            String message = (String) payload.get("message");

            // Validate property exist and available
            Optional<Property> propertyOpt = propertyManager.getPropertyDetails(propertyId);
            if (propertyOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Property not found");
            }

            Application app = rentalApplicationManager.submitApplication(tenantId, propertyId, monthlyIncome, occupation, message);
            return ResponseEntity.ok(app);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Validation Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    // UC-4 & UC-5: Track status / View history
    @GetMapping
    public ResponseEntity<List<Application>> getMyApplications(@RequestParam String tenantId) {
        return ResponseEntity.ok(rentalApplicationManager.getTenantApplications(tenantId));
    }

    // UC-5: Cancel pending application
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelApplication(@PathVariable String id, @RequestBody Map<String, String> payload) {
        try {
            String tenantId = payload.get("tenantId");
            Application app = rentalApplicationManager.cancelApplication(id, tenantId);
            return ResponseEntity.ok(app);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Validation Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    // UC-5: Remove rejected application
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable String id, @RequestParam String tenantId) {
        try {
            rentalApplicationManager.deleteApplication(id, tenantId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Validation Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
}
