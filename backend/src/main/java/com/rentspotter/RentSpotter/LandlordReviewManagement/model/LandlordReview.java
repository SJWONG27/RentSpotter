package com.rentspotter.RentSpotter.LandlordReviewManagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "landlord_reviews")
public class LandlordReview {
    @Id
    private String id;
    private String landlordId;
    private String tenantId;
    private String commentLandlord;
    private Double landlordRating;
    private Date commentDate;

    public LandlordReview() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLandlordId() { return landlordId; }
    public void setLandlordId(String landlordId) { this.landlordId = landlordId; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public String getCommentLandlord() { return commentLandlord; }
    public void setCommentLandlord(String commentLandlord) { this.commentLandlord = commentLandlord; }

    public Double getLandlordRating() { return landlordRating; }
    public void setLandlordRating(Double landlordRating) { this.landlordRating = landlordRating; }

    public Date getCommentDate() { return commentDate; }
    public void setCommentDate(Date commentDate) { this.commentDate = commentDate; }
}
