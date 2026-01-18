// src/main/java/com/rentspotter/RentSpotter/LandlordPropertyManagement/service/PropertyService.java
package com.rentspotter.RentSpotter.LandlordPropertyManagement.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.repository.PropertyRepository;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    private final String UPLOAD_DIR = "uploads/";

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
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
}
