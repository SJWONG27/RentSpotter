package com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.impl;

import com.rentspotter.RentSpotter.LandlordPropertyManagement.model.Property;
import com.rentspotter.RentSpotter.LandlordPropertyManagement.service.PropertyManager;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.RentalRecord;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.repository.RentalRecordRepository;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.HistoryService;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HistoryServiceImpl implements HistoryService {

    private static final Log logger = LogFactory.getLog(HistoryServiceImpl.class);

    @Autowired
    private RentalRecordRepository recordRepository;
    @Autowired
    private PropertyManager propertyManager;

    @Override
    public void saveRecord(RentalRecord record) {
        Property property = propertyManager
                .getPropertyDetails(record.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Invalid property ID"));
        record.setPropertyName(property.getName());
        recordRepository.save(record);
        logger.info("Saved rental record for tenant: " + record);
    }

    @Override
    public List<RentalRecord> getTenantHistory(String tenantId) {
        return recordRepository.findByTenantId(tenantId);
    }

    @Override
    public List<RentalRecord> getLandlordPortfolio(String landlordId) {
        return recordRepository.findByLandlordId(landlordId);
    }

    @Override
    public RentalRecord getRecordById(String id) {
        return recordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found with ID: " + id));
    }
}