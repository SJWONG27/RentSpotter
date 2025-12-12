import React from "react";
import { useNavigate } from "react-router-dom";
import "TenantPOV/component/cardHistory.css";
import "TenantPOV/tenantapplication.css";
import "../../TenantPOV/component/cardApplication.css";
const bedroomIcon = require("./bedroom.png");
const bathroomIcon = require("./bathroom.png");
const sqftIcon = require("./sqft.png");

export interface PropertyCardProps {
  applicationId?: string;
  leaseAgreementId?: string;
  imageUrl: string;
  title: string;
  locationOwner: string;
  bedroom: number;
  bathroom: number;
  sqft: string;
  price: string;
  status: string;
}

const PropertyCard = ({
  applicationId,
  leaseAgreementId,
  imageUrl,
  title,
  locationOwner,
  bedroom,
  bathroom,
  sqft,
  price,
  status,
}: PropertyCardProps) => {
  const nav = useNavigate();
  // Check if any property data is missing
  if (
    !title ||
    !locationOwner ||
    !imageUrl ||
    !bedroom ||
    !bathroom ||
    !sqft ||
    !price
  ) {
    alert("Error: Missing property data!");
  }

  const handleViewPropertyStatus = () => {
    if (status == "Effective" || status == "Expired") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      nav(`/tenantViewAgreement/${leaseAgreementId}`);
    }
  };

  return (
    <div className="applicationList_card" onClick={handleViewPropertyStatus}>
      <div className="history-listing">
        <div className="rentalHistory-image">
          <img src={imageUrl} alt="Rental Property" />
        </div>
        <div className="rentalHistory-details">
          <h2 className="rental_historyTitle">{title}</h2>
          <p className="descript_rental">{locationOwner}</p>

          <div className="facilities-icons">
            <div className="facilities-per-icon">
              <img
                src={bedroomIcon}
                className="bedroomIcon"
                alt="Bedroom Icon"
              />
              <p className="icon-text">{bedroom}</p>
            </div>

            <div className="facilities-per-icon">
              <img
                src={bathroomIcon}
                className="bathroomIcon"
                alt="Bedroom Icon"
              />
              <p className="icon-text">{bathroom}</p>
            </div>

            <div className="facilities-per-icon">
              <img src={sqftIcon} className="sqftIcon" alt="Sqft Icon" />
              <p className="icon-text">{sqft}</p>
            </div>
          </div>
        </div>
        <div className="propertyStatusApplication">
          {/* {isViewLease && (
            <button className="view-lease-btn" onClick={handleViewLease}>
              View Lease
            </button>
          )} */}
          {status == "Effective" && (
            <button className="pending-btn">Active</button>
          )}
          {status != "Effective" && (
            <button className="Expired-btn">Expired</button>
          )}
          <h2 className="propertyPriceApplication">{price}</h2>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;