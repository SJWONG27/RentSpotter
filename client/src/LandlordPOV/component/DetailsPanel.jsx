import React, { useState, useEffect } from "react";
import './detailspanel.css';
import propertyTypeIcon from "./Rental_Icon/propertyTypeIcon.png";
import sqrtIcon from "./Rental_Icon/sqrtIcon.png";
import bedroomIcon from "./Rental_Icon/bedroomIcon.png";
import bathroomIcon from "./Rental_Icon/bathroomIcon.png";
import carparkIcon from "./Rental_Icon/carparkIcon.png";
import furnitureIcon from "./Rental_Icon/furnitureIcon.png";

const DetailsPanel = ({ property }) => {
    const propertyFacilitiesIcons = [propertyTypeIcon, sqrtIcon, bedroomIcon, bathroomIcon, carparkIcon, furnitureIcon];

    const [propertyLocation, setPropertyLocation] = useState();
    const [propertyType, setPropertyType] = useState();
    const [propertyPrice, setPropertyPrice] = useState(0);
    const [propertyName, setPropertyName] = useState();
    const [propertyAddress, setPropertyAddress] = useState();
    const [facilitiesData, setFacilitiesData] = useState([]);
    const [propertyDesc, setPropertyDesc] = useState();
    const [propertyFac, setPropertyFac] = useState();
    const [propertyAccess, setPropertyAccess] = useState();

    useEffect(() => {
        if (property) {
            setPropertyLocation(property.location);
            setPropertyType(property.type);
            setPropertyPrice(property.price);
            setPropertyName(property.name);
            setPropertyAddress(property.address);
            setFacilitiesData([
                property.type,
                `${property.buildUpSize} Sqft`,
                `${property.bedroom} Bedroom`,
                `${property.bathroom} Bathroom`,
                `${property.parking} Carpark`,
                property.furnishing
            ]);
            setPropertyDesc(property.description);
            setPropertyFac(property.facilities);
            setPropertyAccess(property.accessibility);
        }
    }, [property]);

    if (!property) {
        return <div>Loading...</div>;
    }

    return (
        <section className="details-panel">
            <div className="heading">
                <h3 className="property-classfication">{`Property  |  ${propertyLocation} | ${propertyType}`}</h3>
            </div>

            <div className="rental-details">
                <div className="rent-price-unit-panel">
                    <div className="rent-breakdown">
                        <h2 className="rent-price">{`RM ${propertyPrice} Per Month`}</h2>
                        <h3 className="rent-unit">Minimum Rental Duration of Six Months</h3>
                    </div>
                </div>

                <div className="property-info">
                    <div className="property-info-breakdown">
                        <h2 className="property-name">{propertyName}</h2>
                        <h3 className="property-address">{propertyAddress}</h3>
                        
                        <div className="property-facilities">
                            <div className="property-facilities-breakdown">
                                <div className="specs-grid">
                                    {propertyFacilitiesIcons.map((icon, index) => (
                                        <div key={index} className="specs-row">
                                            <div className="icon-wrapper">
                                                <img className="icon-facility" alt='icon' src={icon}/>
                                            </div>
                                            <div className='facility-text'>
                                                {facilitiesData[index]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    
                    <div className="line-block">
                        <hr className="line"></hr>
                    </div>

                    <div className="description-block">
                        <h2 className="description-title">Description</h2>
                        <h3 className="description-text">{propertyDesc}</h3>
                    </div>

                    <div className="description-block">
                        <h2 className="description-title">Facilities</h2>
                        <h3 className="description-text">{propertyFac}</h3>
                    </div>
                    
                    <div className="description-block">
                        <h2 className="description-title">Accessibility</h2>
                        <h3 className="description-text-wrap">
                            <p className="description-text">{propertyAccess}</p>
                        </h3>
                    </div>
                </div>
            </div>
            </div>
        </section>
    );
}

export default DetailsPanel;