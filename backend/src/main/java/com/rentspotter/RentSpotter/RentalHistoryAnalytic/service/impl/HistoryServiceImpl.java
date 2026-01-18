package com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.impl;

import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.RentalRecord;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.repository.RentalRecordRepository;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.HistoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HistoryServiceImpl implements HistoryService {

    @Autowired
    private RentalRecordRepository recordRepository;

    @Override
    public List<RentalRecord> getTenantHistory(String tenantId) {
        // In a real app, we would use a custom query
        return recordRepository.findAll();
    }

    @Override
    public List<RentalRecord> getLandlordPortfolio(String landlordId) {
        return recordRepository.findAll();
    }

    @Override
    public RentalRecord getRecordById(String id) {
        return recordRepository.findById(id).orElse(null);
    }
}