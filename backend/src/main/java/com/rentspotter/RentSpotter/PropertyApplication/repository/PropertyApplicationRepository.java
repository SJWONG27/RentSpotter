package com.rentspotter.RentSpotter.PropertyApplication.repository;

import com.rentspotter.RentSpotter.PropertyApplication.model.PropertyApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface PropertyApplicationRepository extends MongoRepository<PropertyApplication, String> {
    List<PropertyApplication> findByTenantId(String tenantId);
    List<PropertyApplication> findByLandlordId(String landlordId);
    List<PropertyApplication> findByPropertyId(String propertyId);
    Optional<PropertyApplication> findByTenantIdAndPropertyId(String tenantId, String propertyId);
}
