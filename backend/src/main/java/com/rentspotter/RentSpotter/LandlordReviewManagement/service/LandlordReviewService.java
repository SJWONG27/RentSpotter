package com.rentspotter.RentSpotter.LandlordReviewManagement.service;

import com.rentspotter.RentSpotter.LandlordReviewManagement.model.LandlordReview;
import com.rentspotter.RentSpotter.LandlordReviewManagement.repository.LandlordReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LandlordReviewService {
    @Autowired
    private LandlordReviewRepository reviewRepository;

    public List<LandlordReview> getReviewsByLandlordId(String landlordId) {
        return reviewRepository.findByLandlordId(landlordId);
    }

    public LandlordReview saveReview(LandlordReview review) {
        return reviewRepository.save(review);
    }
}
