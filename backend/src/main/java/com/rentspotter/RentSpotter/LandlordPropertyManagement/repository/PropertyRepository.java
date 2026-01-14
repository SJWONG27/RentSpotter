package com.rentspotter.RentSpotter.LandlordPropertyManagement.repository;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PropertyRepository extends MongoRepository<Property, String> {
    List<Property> findByLandlordId(String landlordId);
    List<Property> findByType(String type);
}
