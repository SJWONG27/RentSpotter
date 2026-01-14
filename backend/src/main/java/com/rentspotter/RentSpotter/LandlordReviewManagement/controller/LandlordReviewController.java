package com.rentspotter.RentSpotter.LandlordReviewManagement.controller;

import com.rentspotter.RentSpotter.LandlordReviewManagement.model.LandlordReview;
import com.rentspotter.RentSpotter.LandlordReviewManagement.service.LandlordReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/landlordReview")
public class LandlordReviewController {
    @Autowired
    private LandlordReviewService reviewService;

    @GetMapping("/{landlordId}")
    public ResponseEntity<List<LandlordReview>> getReviews(@PathVariable String landlordId) {
        return ResponseEntity.ok(reviewService.getReviewsByLandlordId(landlordId));
    }

    @PostMapping
    public ResponseEntity<LandlordReview> createReview(@RequestBody LandlordReview review) {
        return ResponseEntity.status(201).body(reviewService.saveReview(review));
    }
}
