package com.rentspotter.RentSpotter.repository;

import com.rentspotter.RentSpotter.model.Property;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends MongoRepository<Property, String> {
    // Basic search methods can be added here if needed, e.g.
    // List<Property> findByType(String type);
    // List<Property> findByPriceLessThan(Double price);
}
