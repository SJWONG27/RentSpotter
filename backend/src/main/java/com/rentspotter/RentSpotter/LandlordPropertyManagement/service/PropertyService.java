// src/main/java/com/rentspotter/RentSpotter/LandlordPropertyManagement/service/PropertyService.java
package com.rentspotter.RentSpotter.LandlordPropertyManagement.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.repository.PropertyRepository;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final MongoTemplate mongoTemplate;

    private final String UPLOAD_DIR = "uploads/";

    public PropertyService(PropertyRepository propertyRepository, MongoTemplate mongoTemplate) {
        this.propertyRepository = propertyRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public Property createProperty(Property property, List<MultipartFile> imageFiles) throws IOException {

        // min 2 photos
        if (imageFiles == null || imageFiles.size() < 2) {
            throw new IllegalArgumentException("Requirement not met: You must upload at least 2 photos.");
        }

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        List<String> photoFilenames = new ArrayList<>();
        for (MultipartFile file : imageFiles) {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            photoFilenames.add(fileName);
        }

        property.setPhotos(photoFilenames);

        if (!photoFilenames.isEmpty()) {
            property.setCoverPhoto(photoFilenames.get(0));
        }

        return propertyRepository.save(property);
    }

    public List<Property> getPropertiesByLandlord(String landlordId) {
        return propertyRepository.findByLandlordId(landlordId);
    }

    public Property getPropertyDetail(String landlordId, String propertyId) {
        return propertyRepository.findByIdAndLandlordId(propertyId, landlordId)
                .orElseThrow(() -> new RuntimeException("Property not found or access denied."));
    }

    public Property updatePropertyDetails(String propertyId, Property newDetails) {
        Property existingProperty = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found with ID: " + propertyId));

        existingProperty.setName(newDetails.getName());
        existingProperty.setType(newDetails.getType());
        existingProperty.setAddress(newDetails.getAddress());
        existingProperty.setLocation(newDetails.getLocation());
        existingProperty.setPostcode(newDetails.getPostcode());
        existingProperty.setPrice(newDetails.getPrice());
        existingProperty.setDescription(newDetails.getDescription());

        // update specs
        existingProperty.setBedroom(newDetails.getBedroom());
        existingProperty.setBathroom(newDetails.getBathroom());
        existingProperty.setFurnishing(newDetails.getFurnishing());
        existingProperty.setParking(newDetails.getParking());
        existingProperty.setFloorLevel(newDetails.getFloorLevel());
        existingProperty.setBuildUpSize(newDetails.getBuildUpSize());
        existingProperty.setFacilities(newDetails.getFacilities());
        existingProperty.setAccessibility(newDetails.getAccessibility());

        return propertyRepository.save(existingProperty);
    }

    public Property setCoverPhoto(String propertyId, String fileName) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (!property.getPhotos().contains(fileName)) {
            throw new RuntimeException("This photo does not exist in this property.");
        }

        property.setCoverPhoto(fileName);
        return propertyRepository.save(property);
    }

    public Property deletePropertyPhoto(String propertyId, String fileName) throws IOException {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        List<String> photos = property.getPhotos();

        if (photos.size() <= 2) {
            throw new RuntimeException("Cannot delete photo. You must maintain at least 2 photos per property.");
        }

        if (!photos.contains(fileName)) {
            throw new RuntimeException("Photo not found in list.");
        }

        photos.remove(fileName);

        if (fileName.equals(property.getCoverPhoto())) {
            if (!photos.isEmpty()) {
                property.setCoverPhoto(photos.get(0));
            } else {
                property.setCoverPhoto(null);
            }
        }
        property.setPhotos(photos);

        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.deleteIfExists(filePath);

        return propertyRepository.save(property);
    }

    public Property addPropertyPhotos(String propertyId, List<MultipartFile> newPhotos) throws IOException {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (newPhotos == null || newPhotos.isEmpty()) {
            throw new IllegalArgumentException("No photos provided.");
        }

        List<String> currentPhotos = property.getPhotos();
        if (currentPhotos == null) {
            currentPhotos = new ArrayList<>();
        }

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : newPhotos) {
            // Generate unique filename
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

            currentPhotos.add(fileName);
        }

        property.setPhotos(currentPhotos);
        return propertyRepository.save(property);
    }

    public void deleteProperty(String landlordId, String propertyId) throws IOException {
        Property property = propertyRepository.findByIdAndLandlordId(propertyId, landlordId)
                .orElseThrow(() -> new RuntimeException("Property not found or access denied."));

        List<String> photos = property.getPhotos();
        if (photos != null) {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            for (String fileName : photos) {
                Path filePath = uploadPath.resolve(fileName);
                Files.deleteIfExists(filePath);
            }
        }

        propertyRepository.delete(property);
    }

    public List<Property> filterProperties(String landlordId, String type, String location, Double minPrice, Double maxPrice, String searchQuery) {

        Query query = new Query();

        query.addCriteria(Criteria.where("landlordId").is(landlordId));

        // Filter by Property Type (Exact Match)
        if (type != null && !type.isEmpty()) {
            query.addCriteria(Criteria.where("type").is(type));
        }

        // Filter by Location (Partial Match / Case Insensitive)
        if (location != null && !location.isEmpty()) {
            query.addCriteria(Criteria.where("location").regex(location, "i"));
        }

        // Filter by Price Range
        if (minPrice != null && maxPrice != null) {
            query.addCriteria(Criteria.where("price").gte(minPrice).lte(maxPrice));
        } else if (minPrice != null) {
            query.addCriteria(Criteria.where("price").gte(minPrice));
        } else if (maxPrice != null) {
            query.addCriteria(Criteria.where("price").lte(maxPrice));
        }

        // Search Query (Matches Name/Title)
        if (searchQuery != null && !searchQuery.isEmpty()) {
            // Match if found in Name OR Location OR Description
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("name").regex(searchQuery, "i"),
                    Criteria.where("location").regex(searchQuery, "i"),
                    Criteria.where("description").regex(searchQuery, "i")
            ));
        }

        return mongoTemplate.find(query, Property.class);
    }
}
