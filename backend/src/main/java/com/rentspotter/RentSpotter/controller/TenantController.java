package com.rentspotter.RentSpotter.controller;

import com.rentspotter.RentSpotter.model.Property;
import com.rentspotter.RentSpotter.model.Application;
import com.rentspotter.RentSpotter.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tenant")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @GetMapping("/properties")
    public List<Property> getAllProperties() {
        return tenantService.getAllProperties();
    }

    @GetMapping("/properties/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable String id) {
        Optional<Property> property = tenantService.getPropertyById(id);
        return property.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/apply")
    public Application submitApplication(@RequestBody Application application) {
        // TODO: Validate tenant and property existence if needed, handling via frontend ID passing for now
        return tenantService.submitApplication(application);
    }

    @GetMapping("/applications/{tenantId}")
    public List<Application> getApplicationsByTenant(@PathVariable String tenantId) {
        return tenantService.getApplicationsByTenantId(tenantId);
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable String id) {
        tenantService.deleteApplication(id);
        return ResponseEntity.ok().build();
    }
}
