package com.rentspotter.RentSpotter.LandlordReviewManagement.repository;

import com.rentspotter.RentSpotter.LandlordReviewManagement.model.LandlordReview;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LandlordReviewRepository extends MongoRepository<LandlordReview, String> {
    List<LandlordReview> findByLandlordId(String landlordId);
}
