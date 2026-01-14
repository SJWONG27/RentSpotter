package com.rentspotter.RentSpotter.PropertyApplication.service;

import com.rentspotter.RentSpotter.PropertyApplication.model.PropertyApplication;
import com.rentspotter.RentSpotter.PropertyApplication.repository.PropertyApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PropertyApplicationService {
    @Autowired
    private PropertyApplicationRepository applicationRepository;

    public PropertyApplication apply(PropertyApplication application) {
        return applicationRepository.save(application);
    }

    public List<PropertyApplication> getApplicationsByTenantId(String tenantId) {
        return applicationRepository.findByTenantId(tenantId);
    }

    public List<PropertyApplication> getApplicationsByLandlordId(String landlordId) {
        return applicationRepository.findByLandlordId(landlordId);
    }

    public List<PropertyApplication> getApplicationsByPropertyId(String propertyId) {
        return applicationRepository.findByPropertyId(propertyId);
    }

    public PropertyApplication getApplicationById(String id) {
        return applicationRepository.findById(id).orElse(null);
    }

    public boolean exists(String tenantId, String propertyId) {
        return applicationRepository.findByTenantIdAndPropertyId(tenantId, propertyId).isPresent();
    }

    public PropertyApplication updateStatus(String id, String status) {
        PropertyApplication application = getApplicationById(id);
        if (application != null) {
            application.setStatus(status);
            return applicationRepository.save(application);
        }
        return null;
    }
}
