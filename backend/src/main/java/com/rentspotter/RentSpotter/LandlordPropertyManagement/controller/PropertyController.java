// src/main/java/com/rentspotter/RentSpotter/LandlordPropertyManagement/controller/PropertyController.java
package com.rentspotter.RentSpotter.LandlordPropertyManagement.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.service.PropertyService;

@RestController
@RequestMapping("/api/landlord/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    // UC-8 Upload new property
    // Test: POST /api/landlord/properties/upload/663c6eb59b18e2e3eab6ab85
    @PostMapping(value = "/upload/{landlordId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> uploadProperty(
            @PathVariable String landlordId,
            @RequestPart("data") Property property, // Expects JSON string
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

    // UC-6 View uploaded property list
    // Test: GET /api/landlord/properties/663c6eb59b18e2e3eab6ab85
    @GetMapping("/{landlordId}")
    public ResponseEntity<List<Property>> getMyProperties(@PathVariable String landlordId) {
        List<Property> properties = propertyService.getPropertiesByLandlord(landlordId);

        if (properties.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(properties);
    }

    // UC-9 View and edit existing property details
    // Test: GET /api/landlord/properties/663c6eb59b18e2e3eab6ab85/696b9f484dd11b797512cddb
    @GetMapping("/{landlordId}/{propertyId}")
    public ResponseEntity<?> getPropertyDetail(
            @PathVariable String landlordId,
            @PathVariable String propertyId
    ) {
        try {
            Property property = propertyService.getPropertyDetail(landlordId, propertyId);
            return ResponseEntity.ok(property);
        } catch (RuntimeException e) {
            // Returns 404 Not Found if the ID or Landlord doesn't match
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Test: PUT /api/landlord/properties/update/696b9f484dd11b797512cddb
    @PutMapping("/update/{propertyId}")
    public ResponseEntity<?> updateProperty(
            @PathVariable String propertyId,
            @RequestBody Property property
    ) {
        try {
            Property updatedProperty = propertyService.updatePropertyDetails(propertyId, property);
            return ResponseEntity.ok(updatedProperty);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-10 Manage property photos
    // Test: PUT /api/landlord/properties/696b9f484dd11b797512cddb/cover
    @PutMapping("/{propertyId}/cover")
    public ResponseEntity<?> setCoverPhoto(
            @PathVariable String propertyId,
            @RequestParam("fileName") String fileName
    ) {
        try {
            Property updatedProperty = propertyService.setCoverPhoto(propertyId, fileName);
            return ResponseEntity.ok(updatedProperty);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Test: DELETE /api/landlord/properties/696b9f484dd11b797512cddb/photo
    @DeleteMapping("/{propertyId}/photo")
    public ResponseEntity<?> deletePhoto(
            @PathVariable String propertyId,
            @RequestParam("fileName") String fileName
    ) {
        try {
            Property updatedProperty = propertyService.deletePropertyPhoto(propertyId, fileName);
            return ResponseEntity.ok(updatedProperty);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Test: POST /api/landlord/properties/696b9f484dd11b797512cddb/photos/add
    @PostMapping(value = "/{propertyId}/photos/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addPhotos(
            @PathVariable String propertyId,
            @RequestPart("photos") List<MultipartFile> photos
    ) {
        try {
            Property updatedProperty = propertyService.addPropertyPhotos(propertyId, photos);
            return ResponseEntity.ok(updatedProperty);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UC-11 Delete existing property
    // Test: DELETE /api/landlord/properties/delete/663c6eb59b18e2e3eab6ab85/696bb580550d4b615195ce33
    @DeleteMapping("/delete/{landlordId}/{propertyId}")
    public ResponseEntity<?> deleteProperty(
            @PathVariable String landlordId,
            @PathVariable String propertyId
    ) {
        try {
            propertyService.deleteProperty(landlordId, propertyId);
            return ResponseEntity.ok("Property deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error deleting files: " + e.getMessage());
        }
    }

    /* UC-7 Filter properties
    Test: GET /api/landlord/properties/663c6eb59b18e2e3eab6ab85/filter
    Filter by Type: .../filter?type=Condo
    Filter by PriceRange: .../filter?minPrice=1000&maxPrice=1500
    Filter by Location: .../filter?location=Petaling
    Filter by Search Query (Name/Location/Description): .../filter?search=cozy
    no filters: .../filter
     */
    @GetMapping("/{landlordId}/filter")
    public ResponseEntity<List<Property>> filterProperties(
            @PathVariable String landlordId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String search
    ) {
        List<Property> filteredList = propertyService.filterProperties(
                landlordId, type, location, minPrice, maxPrice, search
        );

        if (filteredList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(filteredList);
    }
}
