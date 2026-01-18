package com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.impl;

import com.rentspotter.RentSpotter.RentalHistoryAnalytic.dto.RatingDTO;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.Rating;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.repository.RatingRepository;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.NotificationService;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.RatingService;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.RatingValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RatingServiceImpl implements RatingService {

    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private RatingValidationService validationService;
    @Autowired private NotificationService notificationService;

    @Override
    public Rating submitRating(RatingDTO ratingDTO) {
        // Guard against vulgar words
        if (!validationService.isValidComment(ratingDTO.getComment())) {
            throw new RuntimeException("Rating rejected: Profanity detected.");
        }
        // Guard against spamming
        if (validationService.isSpamming(ratingDTO.getRaterId())) {
            throw new RuntimeException("Rating rejected: You are rating too frequently.");
        }
        // Guard against sentiment inconsistency
        if (!validationService.isSentimentConsistent(ratingDTO.getScore(), ratingDTO.getComment())) {
            throw new IllegalArgumentException("Review rejected: Your comment contradicts your high rating.");
        }
        // Ensure score is strictly 1-5, clamp it if necessary
        int finalScore = Math.max(1, Math.min(5, ratingDTO.getScore()));
        Rating rating = new Rating();
        rating.setRaterId(ratingDTO.getRaterId());
        rating.setRatedUserId(ratingDTO.getRatedUserId());
        rating.setComment(ratingDTO.getComment());
        rating.setScore(finalScore);
        Rating savedRating = ratingRepository.save(rating);
        String msg = "You received a new " + finalScore + "-star rating!";
        notificationService.notifyUser(rating.getRatedUserId(), msg);
        return savedRating;
    }

    @Override
    public double getTrustScore(String userId) {
        // Weighted calculation
        Optional<List<Rating>> ratings = Optional.ofNullable(ratingRepository.findByRatedUserId(userId));
        if (ratings.isEmpty()) return 0.0;
        double totalScore = 0;
        for (Rating r : ratings.get()) {
            totalScore += r.getScore();
        }
        // Round to 1 decimal place
        double average = totalScore / ratings.get().size();
        return Math.round(average * 10.0) / 10.0;
    }
}