package com.rentspotter.RentSpotter.LeaseAgreementManagement.model;

import com.rentspotter.RentSpotter.Authentication.model.User;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;


@Document(collection = "leases")
public class LeaseModel {
    @Id
    private String id;

    @DBRef
    private User tenant;

    @DBRef
    private User landlord;


}
