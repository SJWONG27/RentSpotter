package com.rentspotter.RentSpotter.LandlordPropertyManagement.model;

import com.rentspotter.RentSpotter.Authentication.model.User;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "landlords")
public class Landlord extends User {
    // Landlord specific fields
}
