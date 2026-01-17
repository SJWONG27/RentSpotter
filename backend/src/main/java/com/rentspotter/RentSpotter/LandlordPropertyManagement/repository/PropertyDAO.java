package com.rentspotter.RentSpotter.LandlordPropertyManagement.repository;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyDAO extends MongoRepository<Property, String> {
    List<Property> findByLandlordId(String landlordId);
}

