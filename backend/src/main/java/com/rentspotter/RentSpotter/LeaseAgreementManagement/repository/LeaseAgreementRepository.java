package com.rentspotter.RentSpotter.LeaseAgreementManagement.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.rentspotter.RentSpotter.LeaseAgreementManagement.model.LeaseAgreementModel;

import java.util.List;
import java.util.Optional;

public interface LeaseAgreementRepository extends MongoRepository<LeaseAgreementModel, String> {
    Optional<LeaseAgreementModel> findByApplicationId(String applicationId);
    List<LeaseAgreementModel> findByTenantIdOrderByDayDesc(String tenantId); // Simplified sort
}
