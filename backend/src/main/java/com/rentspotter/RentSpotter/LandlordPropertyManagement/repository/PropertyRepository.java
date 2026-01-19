// src/main/java/com/rentspotter/RentSpotter/LandlordPropertyManagement/repository/PropertyRepository.java
package com.rentspotter.RentSpotter.LandlordPropertyManagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;

public interface PropertyRepository extends MongoRepository<Property, String> {

    List<Property> findByLandlordId(String landlordId);

    Optional<Property> findByIdAndLandlordId(String id, String landlordId);
}
