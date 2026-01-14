package com.rentspotter.RentSpotter.LandlordPropertyManagement.service;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Value("${upload.dir}")
    private String uploadDir;

    public Property saveProperty(Property property) {
        return propertyRepository.save(property);
    }

    public List<Property> getPropertiesByLandlordId(String landlordId) {
        return propertyRepository.findByLandlordId(landlordId);
    }

    public Property getPropertyById(String id) {
        return propertyRepository.findById(id).orElse(null);
    }

    public Property addPhoto(String propertyId, MultipartFile file) throws IOException {
        Property property = getPropertyById(propertyId);
        if (property == null) return null;

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        if (property.getPhotos() == null) {
            property.setPhotos(new ArrayList<>());
        }
        property.getPhotos().add(fileName);

        // If cover photo is not set, set this one as cover photo
        if (property.getCoverPhoto() == null) {
            property.setCoverPhoto(fileName);
        }

        return propertyRepository.save(property);
    }

    public boolean deletePhoto(String propertyId, String photoName) throws IOException {
        Property property = getPropertyById(propertyId);
        if (property == null) return false;

        boolean removed = false;
        if (property.getPhotos() != null) {
            removed = property.getPhotos().remove(photoName);
        }

        if (photoName.equals(property.getCoverPhoto())) {
            property.setCoverPhoto(property.getPhotos() != null && !property.getPhotos().isEmpty() ? property.getPhotos().get(0) : null);
            removed = true;
        }

        if (removed) {
            propertyRepository.save(property);
            Path filePath = Paths.get(uploadDir).resolve(photoName);
            Files.deleteIfExists(filePath);
        }

        return removed;
    }

    public Property makeCoverPhoto(String propertyId, String photoName) {
        Property property = getPropertyById(propertyId);
        if (property == null) return null;

        if (property.getPhotos() != null && property.getPhotos().contains(photoName)) {
            property.setCoverPhoto(photoName);
            return propertyRepository.save(property);
        }
        return null;
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public List<Property> getPropertiesByType(String type) {
        return propertyRepository.findByType(type);
    }
}
