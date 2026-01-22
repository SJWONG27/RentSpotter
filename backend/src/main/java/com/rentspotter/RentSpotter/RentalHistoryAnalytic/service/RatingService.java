package com.rentspotter.RentSpotter.RentalHistoryAnalytic.service;

import com.rentspotter.RentSpotter.RentalHistoryAnalytic.dto.RatingRequestDTO;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.Rating;

public interface RatingService {
    Rating submitRating(RatingRequestDTO ratingRequestDTO);
    double getTrustScore(String userId); // Returns average score
}