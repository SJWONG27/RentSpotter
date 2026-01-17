// src/main/java/com/rentspotter/RentSpotter/LandlordPropertyManagement/controller/PropertyController.java

package com.rentspotter.RentSpotter.LandlordPropertyManagement.controller;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.service.PropertyService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/landlord/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // Endpoint: POST /api/landlord/properties/upload/{landlordId}
    @PostMapping(value = "/upload/{landlordId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> uploadProperty(
            @PathVariable String landlordId,
            @RequestPart("data") Property property,           // Expects JSON string
            @RequestPart("photos") List<MultipartFile> photos // Expects File objects
    ) {
        try {
            property.setLandlordId(landlordId);
            Property savedProperty = propertyService.createProperty(property, photos);
            return ResponseEntity.ok(savedProperty);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Server Error: " + e.getMessage());
        }
    }
}