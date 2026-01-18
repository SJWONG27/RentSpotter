package com.rentspotter.RentSpotter.RentalHistoryAnalytic.controller;

import com.rentspotter.RentSpotter.RentalHistoryAnalytic.dto.RatingDTO;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.Rating;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.RentalRecord;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.DocumentService;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.HistoryService;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
public class RentalHistoryController {

    @Autowired
    private HistoryService historyService;
    @Autowired
    private RatingService ratingService;
    @Autowired
    private DocumentService documentService;

    // UC-19 + UC-20: View History AND Tenant Trust Score
    @GetMapping("/tenant/{tenantId}")
    public Map<String, Object> getTenantDashboard(String tenantId) {
        List<RentalRecord> history = historyService.getTenantHistory(tenantId);
        double score = ratingService.getTrustScore(tenantId);

        return Map.of(
                "history", history,
                "myTrustScore", score
        );
    }

    // UC-21 + UC-22: View Portfolio AND Landlord Trust Score
    @GetMapping("/landlord/{landlordId}")
    public Map<String, Object> getLandlordDashboard(String landlordId) {
        List<RentalRecord> portfolio = historyService.getLandlordPortfolio(landlordId);
        double score = ratingService.getTrustScore(landlordId);

        return Map.of(
                "portfolio", portfolio,
                "myReputationScore", score
        );

    }

    // UC-23 & UC-24: Rate Landlord / Rate Tenant
    @PostMapping("/rate")
    public ResponseEntity<?> submitRating(@RequestBody @Valid RatingDTO ratingDTO) {
        try{
            Rating submittedRating = ratingService.submitRating(ratingDTO);
            return ResponseEntity.ok(submittedRating);
        }
        catch (Exception e){
            Map<String, Object> errorMessage = new HashMap<>();
            errorMessage.put("timestamp", LocalDateTime.now());
            errorMessage.put("message", e.getMessage());
            return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
        }
    }

    // UC-25: Generate Reference Letter
    @GetMapping("/document/{recordId}")
    public String downloadLetter(@PathVariable String recordId) {
        return documentService.generateReferenceLetter(recordId);
    }
}
