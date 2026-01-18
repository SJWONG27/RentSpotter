package com.rentspotter.RentSpotter.TenantApplication.repository;

import com.rentspotter.RentSpotter.TenantApplication.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationDAO extends MongoRepository<Application, String> {
    List<Application> findByTenantId(String tenantId);
    List<Application> findByPropertyId(String propertyId);
}
