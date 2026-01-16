package com.rentspotter.RentSpotter.TenantApplication.model;

import com.rentspotter.RentSpotter.Authentication.model.User;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tenants")
public class Tenant extends User {
    // Tenant specific fields can go here if any.
    // For now, it just extends User as per dependency table (Tenant -> User).
}
