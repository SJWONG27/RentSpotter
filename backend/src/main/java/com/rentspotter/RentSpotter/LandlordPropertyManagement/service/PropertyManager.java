package com.rentspotter.RentSpotter.LandlordPropertyManagement.service;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.repository.PropertyDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PropertyManager {

    @Autowired
    private PropertyDAO propertyDAO;

    public List<Property> getAllAvailableProperties() {
        return propertyDAO.findByAvailableTrue();
    }

    public List<Property> filterProperties(Double maxPrice, String propertyType, String furnishedStatus) {
        List<Property> properties = propertyDAO.findByAvailableTrue();

        if (maxPrice != null) {
            properties = properties.stream()
                .filter(p -> p.getPrice() <= maxPrice)
                .collect(Collectors.toList());
        }
        if (propertyType != null && !propertyType.isEmpty()) {
            properties = properties.stream()
                .filter(p -> p.getPropertyType().equalsIgnoreCase(propertyType))
                .collect(Collectors.toList());
        }
        if (furnishedStatus != null && !furnishedStatus.isEmpty()) {
            properties = properties.stream()
                .filter(p -> p.getFurnishedStatus().equalsIgnoreCase(furnishedStatus))
                .collect(Collectors.toList());
        }
        return properties;
    }

    public Optional<Property> getPropertyDetails(String propertyId) {
        return propertyDAO.findById(propertyId);
    }
}
