package com.rentspotter.RentSpotter.RentalHistoryAnalytic.controller;

import com.rentspotter.RentSpotter.RentalHistoryAnalytic.dto.RatingRequestDTO;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.Rating;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.model.RentalRecord;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.DocumentService;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.HistoryService;
import com.rentspotter.RentSpotter.RentalHistoryAnalytic.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<Map<String, Object>> getTenantDashboard(@PathVariable String tenantId) {
        List<RentalRecord> history = historyService.getTenantHistory(tenantId);
        double score = ratingService.getTrustScore(tenantId);

        return  ResponseEntity.ok(Map.of(
                "history", history,
                "myTrustScore", score
        ));
    }

    // UC-21 + UC-22: View Portfolio AND Landlord Trust Score
    @GetMapping("/landlord/{landlordId}")
    public Map<String, Object> getLandlordDashboard(@PathVariable String landlordId) {
        List<RentalRecord> portfolio = historyService.getLandlordPortfolio(landlordId);
        double score = ratingService.getTrustScore(landlordId);

        return Map.of(
                "portfolio", portfolio,
                "myReputationScore", score
        );

    }

    // UC-23 & UC-24: Rate Landlord / Rate Tenant
    @PostMapping("/rate")
    public ResponseEntity<?> submitRating(@RequestBody @Valid RatingRequestDTO ratingRequestDTO) {
        try{
            Rating submittedRating = ratingService.submitRating(ratingRequestDTO);
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
    public ResponseEntity<String> downloadLetter(@PathVariable String recordId) {
        String referenceLetter = documentService.generateReferenceLetter(recordId);
        return ResponseEntity.ok(referenceLetter);
    }
}
