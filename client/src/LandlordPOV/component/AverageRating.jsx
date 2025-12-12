import React from "react";
import StarsGroup from "./LandlordStarsGroup";
import "./averagerating.css";

const AverageRating = ({ numOfReview, avg }) => {
  
    const reviewNumbers = "(" + numOfReview + " Reviews)";
    const avgRatingScore = avg + "/5";
    const rating = Math.round(avg); 

    return (
        <div className="avg-rating-group">
            <div className="avg-col">
                <StarsGroup rating={rating}/>
            </div>

            <div className="avg-col">
                <span className="review-score">{avgRatingScore}</span>
            </div>

            <div className="col">
                <span className="review-number">{reviewNumbers}</span>
            </div>
        </div>
    );
};

export default AverageRating;