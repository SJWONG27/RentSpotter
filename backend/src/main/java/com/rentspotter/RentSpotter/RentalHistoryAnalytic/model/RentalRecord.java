package com.rentspotter.RentSpotter.RentalHistoryAnalytic.model;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Getter
@Setter
@ToString
@Document(collection = "rental_records")
public class RentalRecord {

    @Id
    private String id;

    private String tenantId;
    private String landlordId;
    private String propertyId;
    private String propertyName;
    private String startDate;
    private String endDate;
    private Double rentalAmount;
}
