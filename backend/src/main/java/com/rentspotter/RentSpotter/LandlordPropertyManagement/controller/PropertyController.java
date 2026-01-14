package com.rentspotter.RentSpotter.LandlordPropertyManagement.controller;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/landlord/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping("/upload/{landlordId}")
    public ResponseEntity<Property> uploadProperty(@PathVariable String landlordId, @RequestBody Property property) {
        property.setLandlordId(landlordId);
        Property savedProperty = propertyService.saveProperty(property);
        return new ResponseEntity<>(savedProperty, HttpStatus.CREATED);
    }

    @PutMapping("/uploadPhoto/{propertyId}")
    public ResponseEntity<?> uploadPhoto(@PathVariable String propertyId, @RequestParam("photo") MultipartFile file) {
        try {
            Property updatedProperty = propertyService.addPhoto(propertyId, file);
            if (updatedProperty == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found");
            }
            return ResponseEntity.ok(updatedProperty);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading photo: " + e.getMessage());
        }
    }

    @PutMapping("/uploadPhotoNext/{propertyId}")
    public ResponseEntity<?> uploadPhotoNext(@PathVariable String propertyId, @RequestParam("photo") MultipartFile file) {
        return uploadPhoto(propertyId, file);
    }

    @GetMapping("/uploadPhoto/getPhoto/{propertyId}")
    public ResponseEntity<?> getPhotos(@PathVariable String propertyId) {
        Property property = propertyService.getPropertyById(propertyId);
        if (property == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found");
        }
        return ResponseEntity.ok(property);
    }

    @DeleteMapping("/{propertyId}/deletePhoto/{photoName}")
    public ResponseEntity<?> deletePhoto(@PathVariable String propertyId, @PathVariable String photoName) {
        try {
            boolean deleted = propertyService.deletePhoto(propertyId, photoName);
            if (deleted) {
                return ResponseEntity.ok("Photo deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Photo or property not found");
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting photo: " + e.getMessage());
        }
    }

    @PutMapping("/makeCoverPhoto/{propertyId}/{photoName}")
    public ResponseEntity<?> makeCoverPhoto(@PathVariable String propertyId, @PathVariable String photoName) {
        Property updatedProperty = propertyService.makeCoverPhoto(propertyId, photoName);
        if (updatedProperty == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property or photo not found");
        }
        return ResponseEntity.ok(updatedProperty);
    }

    @GetMapping("/user/{landlordId}")
    public ResponseEntity<?> getPropertiesByLandlord(@PathVariable String landlordId) {
        return ResponseEntity.ok(propertyService.getPropertiesByLandlordId(landlordId));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/{propertyId}")
    public ResponseEntity<?> getPropertyById(@PathVariable String propertyId) {
        Property property = propertyService.getPropertyById(propertyId);
        if (property == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Property not found");
        }
        return ResponseEntity.ok(property);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<?> getPropertiesByType(@PathVariable String type) {
        return ResponseEntity.ok(propertyService.getPropertiesByType(type));
    }
}
