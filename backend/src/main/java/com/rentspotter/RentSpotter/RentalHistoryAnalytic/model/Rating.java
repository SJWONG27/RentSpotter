package com.rentspotter.RentSpotter.RentalHistoryAnalytic.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "ratings")
public class Rating {
    @Id
    private String id;
    private String raterId;
    private String ratedUserId;
    private int score;
    private String comment;
}



