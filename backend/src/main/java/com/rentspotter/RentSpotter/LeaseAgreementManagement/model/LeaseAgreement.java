package com.rentspotter.RentSpotter.LeaseAgreementManagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "leaseAgreements")
public class LeaseAgreement {
    @Id
    private String id;
    private String tenantId;
    private String landlordId;
    private String propertyId;
    private String applicationId;
    private String leaseStatus; // "Effective", "Expired", "Pending"
    private String day;
    private String month;
    private String year;
    private String lessorName;
    private String lessorIc;
    private String lesseeName;
    private String address;
    private String effectiveDate;
    private String expireDate;
    private String rentRmWord;
    private String rentRmNum;
    private String advanceDay;
    private String depositRmWord;
    private String depositRmNum;
    private String lessorAdd;
    private String lessorTel;
    private String lessorFax;
    private String lesseeAdd;
    private String lesseeTel;
    private String lesseeFax;
    private String lessorDesignation;
    private String lessorSignature; // Base64 or URL
    private String lesseeIc;
    private String lesseeDesignation;
    private String lesseeSignature; // Base64 or URL
    private boolean completed;
    private String pdf;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public String getLandlordId() { return landlordId; }
    public void setLandlordId(String landlordId) { this.landlordId = landlordId; }

    public String getPropertyId() { return propertyId; }
    public void setPropertyId(String propertyId) { this.propertyId = propertyId; }

    public String getApplicationId() { return applicationId; }
    public void setApplicationId(String applicationId) { this.applicationId = applicationId; }

    public String getLeaseStatus() { return leaseStatus; }
    public void setLeaseStatus(String leaseStatus) { this.leaseStatus = leaseStatus; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getLessorName() { return lessorName; }
    public void setLessorName(String lessorName) { this.lessorName = lessorName; }

    public String getLessorIc() { return lessorIc; }
    public void setLessorIc(String lessorIc) { this.lessorIc = lessorIc; }

    public String getLesseeName() { return lesseeName; }
    public void setLesseeName(String lesseeName) { this.lesseeName = lesseeName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(String effectiveDate) { this.effectiveDate = effectiveDate; }

    public String getExpireDate() { return expireDate; }
    public void setExpireDate(String expireDate) { this.expireDate = expireDate; }

    public String getRentRmWord() { return rentRmWord; }
    public void setRentRmWord(String rentRmWord) { this.rentRmWord = rentRmWord; }

    public String getRentRmNum() { return rentRmNum; }
    public void setRentRmNum(String rentRmNum) { this.rentRmNum = rentRmNum; }

    public String getAdvanceDay() { return advanceDay; }
    public void setAdvanceDay(String advanceDay) { this.advanceDay = advanceDay; }

    public String getDepositRmWord() { return depositRmWord; }
    public void setDepositRmWord(String depositRmWord) { this.depositRmWord = depositRmWord; }

    public String getDepositRmNum() { return depositRmNum; }
    public void setDepositRmNum(String depositRmNum) { this.depositRmNum = depositRmNum; }

    public String getLessorAdd() { return lessorAdd; }
    public void setLessorAdd(String lessorAdd) { this.lessorAdd = lessorAdd; }

    public String getLessorTel() { return lessorTel; }
    public void setLessorTel(String lessorTel) { this.lessorTel = lessorTel; }

    public String getLessorFax() { return lessorFax; }
    public void setLessorFax(String lessorFax) { this.lessorFax = lessorFax; }

    public String getLesseeAdd() { return lesseeAdd; }
    public void setLesseeAdd(String lesseeAdd) { this.lesseeAdd = lesseeAdd; }

    public String getLesseeTel() { return lesseeTel; }
    public void setLesseeTel(String lesseeTel) { this.lesseeTel = lesseeTel; }

    public String getLesseeFax() { return lesseeFax; }
    public void setLesseeFax(String lesseeFax) { this.lesseeFax = lesseeFax; }

    public String getLessorDesignation() { return lessorDesignation; }
    public void setLessorDesignation(String lessorDesignation) { this.lessorDesignation = lessorDesignation; }

    public String getLessorSignature() { return lessorSignature; }
    public void setLessorSignature(String lessorSignature) { this.lessorSignature = lessorSignature; }

    public String getLesseeIc() { return lesseeIc; }
    public void setLesseeIc(String lesseeIc) { this.lesseeIc = lesseeIc; }

    public String getLesseeDesignation() { return lesseeDesignation; }
    public void setLesseeDesignation(String lesseeDesignation) { this.lesseeDesignation = lesseeDesignation; }

    public String getLesseeSignature() { return lesseeSignature; }
    public void setLesseeSignature(String lesseeSignature) { this.lesseeSignature = lesseeSignature; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public String getPdf() { return pdf; }
    public void setPdf(String pdf) { this.pdf = pdf; }
}
