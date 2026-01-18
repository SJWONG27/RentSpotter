package com.rentspotter.RentSpotter.RentalHistoryAnalytic.service;

import com.rentspotter.RentSpotter.RentalHistoryAnalytic.dto.RatingDTO;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.Rating;

public interface RatingService {
    Rating submitRating(RatingDTO ratingDTO);
    double getTrustScore(String userId); // Returns average score
}