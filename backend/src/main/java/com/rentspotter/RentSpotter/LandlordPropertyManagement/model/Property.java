package com.rentspotter.RentSpotter.LandlordPropertyManagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "properties")
public class Property {
    @Id
    private String id;
    private String landlordId;
    private String title;
    private String address;
    private Double price;
    private String propertyType; // e.g., "Apartment", "House"
    private String furnishedStatus; // e.g., "Furnished", "Unfurnished"
    private List<String> amenities;
    private String description;
    private Date listingDate;
    private Boolean available;

    // Constructors
    public Property() {}

    public Property(String landlordId, String title, String address, Double price, String propertyType, String furnishedStatus, List<String> amenities, String description, Date listingDate, Boolean available) {
        this.landlordId = landlordId;
        this.title = title;
        this.address = address;
        this.price = price;
        this.propertyType = propertyType;
        this.furnishedStatus = furnishedStatus;
        this.amenities = amenities;
        this.description = description;
        this.listingDate = listingDate;
        this.available = available;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getLandlordId() { return landlordId; }
    public void setLandlordId(String landlordId) { this.landlordId = landlordId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getPropertyType() { return propertyType; }
    public void setPropertyType(String propertyType) { this.propertyType = propertyType; }

    public String getFurnishedStatus() { return furnishedStatus; }
    public void setFurnishedStatus(String furnishedStatus) { this.furnishedStatus = furnishedStatus; }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getListingDate() { return listingDate; }
    public void setListingDate(Date listingDate) { this.listingDate = listingDate; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
}
