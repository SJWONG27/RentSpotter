package com.rentspotter.RentSpotter.PropertyApplication.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "applications")
public class PropertyApplication {
    @Id
    private String id;
    private String propertyId;
    private String tenantId;
    private String landlordId;
    private String status; // e.g., "PENDING", "APPROVED", "REJECTED"
    private Date applicationDate;

    public PropertyApplication() {
        this.status = "PENDING";
        this.applicationDate = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPropertyId() { return propertyId; }
    public void setPropertyId(String propertyId) { this.propertyId = propertyId; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public String getLandlordId() { return landlordId; }
    public void setLandlordId(String landlordId) { this.landlordId = landlordId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getApplicationDate() { return applicationDate; }
    public void setApplicationDate(Date applicationDate) { this.applicationDate = applicationDate; }
}
