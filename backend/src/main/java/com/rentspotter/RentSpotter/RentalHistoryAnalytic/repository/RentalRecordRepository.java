package com.rentspotter.RentSpotter.RentalHistoryAnalytic.repository;


import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.RentalRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RentalRecordRepository extends MongoRepository<RentalRecord, String> {
    List<RentalRecord> findByTenantId(String tenantId);
    List<RentalRecord> findByLandlordId(String landlordId);
}
