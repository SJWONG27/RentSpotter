package com.rentspotter.RentSpotter.PropertyApplication.controller;

import com.rentspotter.RentSpotter.PropertyApplication.model.PropertyApplication;
import com.rentspotter.RentSpotter.PropertyApplication.service.PropertyApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class PropertyApplicationController {
    @Autowired
    private PropertyApplicationService applicationService;

    @PostMapping("/apply")
    public ResponseEntity<PropertyApplication> apply(@RequestBody PropertyApplication application) {
        return ResponseEntity.status(201).body(applicationService.apply(application));
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<PropertyApplication>> getTenantApplications(@PathVariable String tenantId) {
        return ResponseEntity.ok(applicationService.getApplicationsByTenantId(tenantId));
    }

    @GetMapping("/landlord/{landlordId}")
    public ResponseEntity<List<PropertyApplication>> getLandlordApplications(@PathVariable String landlordId) {
        return ResponseEntity.ok(applicationService.getApplicationsByLandlordId(landlordId));
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<PropertyApplication>> getPropertyApplications(@PathVariable String propertyId) {
        return ResponseEntity.ok(applicationService.getApplicationsByPropertyId(propertyId));
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<PropertyApplication> getApplicationById(@PathVariable String applicationId) {
        PropertyApplication application = applicationService.getApplicationById(applicationId);
        if (application == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(application);
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkExistence(@RequestParam String tenantId, @RequestParam String propertyId) {
        boolean exists = applicationService.exists(tenantId, propertyId);
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<PropertyApplication> updateStatus(@PathVariable String applicationId, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        PropertyApplication updated = applicationService.updateStatus(applicationId, status);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }
}
