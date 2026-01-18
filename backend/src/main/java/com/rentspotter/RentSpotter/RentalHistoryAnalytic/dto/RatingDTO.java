package com.rentspotter.RentSpotter.RentalHistoryAnalytic.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingDTO {
    @NotBlank(message = "Rater ID cannot be blank")
    private String raterId;

    @NotBlank(message = "Rated User ID cannot be blank")
    private String ratedUserId;

    @NotNull (message = "Score cannot be null")
    @Min(value = 1, message = "Score must be at least 1")
    @Max(value = 5, message = "Score must be at most 5")
    private int score;

    @NotBlank (message = "Comment cannot be blank")
    private String comment;
}
