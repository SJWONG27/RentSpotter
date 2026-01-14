package com.rentspotter.RentSpotter.LeaseAgreementManagement.repository;

import com.rentspotter.RentSpotter.LeaseAgreementManagement.model.LeaseAgreement;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LeaseAgreementRepository extends MongoRepository<LeaseAgreement, String> {
    List<LeaseAgreement> findByTenantId(String tenantId);
}
