package com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.impl;

import com.rentspotter.RentSpotter.Authentication.model.User;
import com.rentspotter.RentSpotter.Authentication.service.UserService;
import com.rentspotter.RentSpotter.LeaseAgreementManagement.service.EmailService;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.dto.RatingRequestDTO;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.Rating;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.repository.RatingRepository;
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
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserService userService;

    @Override
    public Rating submitRating(RatingRequestDTO ratingRequestDTO) {
        // Guard against vulgar words
        if (!validationService.isValidComment(ratingRequestDTO.getComment())) {
            throw new RuntimeException("Rating rejected: Profanity detected.");
        }
        // Guard against spamming
        if (validationService.isSpamming(ratingRequestDTO.getRaterId())) {
            throw new RuntimeException("Rating rejected: You are rating too frequently.");
        }
        // Guard against sentiment inconsistency
        if (!validationService.isSentimentConsistent(ratingRequestDTO.getScore(), ratingRequestDTO.getComment())) {
            throw new RuntimeException("Review rejected: Your comment contradicts your high rating.");
        }
        // Ensure score is strictly 1-5, clamp it if necessary
        int finalScore = Math.max(1, Math.min(5, ratingRequestDTO.getScore()));

        // Transform DTO to entity and save
        Rating rating = new Rating();
        rating.setRaterId(ratingRequestDTO.getRaterId());
        rating.setRatedUserId(ratingRequestDTO.getRatedUserId());
        rating.setComment(ratingRequestDTO.getComment());
        rating.setScore(finalScore);
        Rating savedRating = ratingRepository.save(rating);

        sendRatingNotification(rating);
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

    private void sendRatingNotification(Rating rating) {
        String msg = "You received a new " + rating.getScore() + "-star rating!";
        Optional<User> ratedUser = Optional.ofNullable(userService.getUserById(rating.getRatedUserId()));
        if (ratedUser.isPresent()){
            emailService.sendEmail(ratedUser.get().getEmail(), "New Rating Received", msg);}
        else{
            throw new RuntimeException("Rated user not found for notification.");
        }
    }
}