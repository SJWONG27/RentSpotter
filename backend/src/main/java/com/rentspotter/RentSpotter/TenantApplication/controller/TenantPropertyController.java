package com.rentspotter.RentSpotter.TenantApplication.controller;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tenant/properties")
public class TenantPropertyController {

    @Autowired
    private PropertyService propertyService;

    // UC-1: View property listings with filters
    @GetMapping
    public ResponseEntity<List<Property>> getProperties(
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String furnishedStatus) {
        List<Property> properties = propertyService.filterPublicProperties(maxPrice, propertyType, furnishedStatus);
        return ResponseEntity.ok(properties);
    }

    // UC-2: View property details
    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyDetails(@PathVariable String id) {
        Optional<Property> property = propertyService.getPropertyDetails(id);
        return property.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
