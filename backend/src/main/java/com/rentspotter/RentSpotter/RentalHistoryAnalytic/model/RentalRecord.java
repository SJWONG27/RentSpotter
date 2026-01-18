package com.rentspotter.RentSpotter.RentalHistoryAnalytic.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDate;

@Data
@Document(collection = "rental_records") // Replaces @Entity
public class RentalRecord {

    @Id // No @GeneratedValue needed; Mongo generates a unique String ID
    private String id; // Change Long to String (standard for Mongo ObjectIds)

    private String tenantId;
    private String landlordId;
    private String propertyName;
    private LocalDate startDate;
    private LocalDate endDate;
}
