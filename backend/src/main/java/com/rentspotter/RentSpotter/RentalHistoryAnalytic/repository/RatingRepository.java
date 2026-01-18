package com.rentspotter.RentSpotter.RentalHistoryAnalytic.repository;


import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RatingRepository extends MongoRepository<Rating, String> {
    List<Rating> findByRatedUserId(String ratedUserId);
}