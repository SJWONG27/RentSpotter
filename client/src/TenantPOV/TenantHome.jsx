import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import "../GeneralPage/home.css";
import "bootstrap/dist/js/bootstrap.bundle";
import CardProperty from "../component/CardProperty";
import { FlipWords } from "../LandlordPOV/components/ui/flip-words";

const TenantHome = () => {

  const [propertyList, setPropertyList] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [locations, setLocations] = useState(["All Location"]);

  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  const [selectedOption3, setSelectedOption3] = useState(null);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);

  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const dropdownRef3 = useRef(null);

  const properties = ["All Properties Type","Condo", "Commercial", "Landed", "Room"];
  const priceRanges = ["All Price Range","RM 500 Below","RM 500 - RM 1000", "RM 1001 - RM 1500", "RM 1501 - RM 2000","RM 2001 - RM 2500","RM 2500 Above"];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/applications/home/property'); 
        setPropertyList(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    // Call setPropertyToCardData only when propertyList is updated
    setPropertyToCardData();
  }, [propertyList]);

  const setPropertyToCardData = () => {
    const mappedCardData = propertyList.map(property => ({
      propertyId: property._id,
      imgSrc: `http://localhost:5000/uploads/${property.coverPhoto}`,
      cardTitle1: `RM ${property.price} Per Month`,
      cardTitle2: property.name,
      cardText: property.address,
      roomDetails: [property.bedroom, property.bathroom, `${property.buildUpSize}sf`],
      propertyType: property.type,
      location: property.location,
      priceRange: determinePriceRange(property.price)
    }));
    setCardData(mappedCardData);

    const uniqueLocations = [...new Set(propertyList.map(property => property.location))];
    setLocations(["All Location", ...uniqueLocations]);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target)
      ) {
        setIsPropertyTypeOpen(false);
      }
      if (
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target)
      ) {
        setIsLocationOpen(false);
      }
      if (
        dropdownRef3.current &&
        !dropdownRef3.current.contains(event.target)
      ) {
        setIsPriceRangeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const determinePriceRange = (price) => {
    if (price <= 500) {
      return "RM 500 Below";
    } else if (price <= 1000) {
      return "RM 500 - RM 1000";
    } else if (price <= 1500) {
      return "RM 1001 - RM 1500";
    } else if (price <= 2000) {
      return "RM 1501 - RM 2000";
    } else if (price <= 2500) {
      return "RM 2001 - RM 2500";
    } else {
      return "RM 2500 Above";
    }
  };

  const handleSearchButtonClick = () => {
    setIsSearchClicked(true);
    const results = cardData.filter((card) => {
      const matchesType =
        selectedOption1 === "All Properties Type" ||
        !selectedOption1 ||
        card.propertyType === selectedOption1;
      const matchesLocation =
        selectedOption2 === "All Location" ||
        !selectedOption2 ||
        card.location === selectedOption2;
      const matchesPriceRange =
        selectedOption3 === "All Price Range" ||
        !selectedOption3 ||
        card.priceRange === selectedOption3;
      return matchesType && matchesLocation && matchesPriceRange;
    });
    setFilteredResults(results);
  };

  const selectOption = (option, setter, refSetter) => {
    setter(option);
    refSetter(false);
  };

  const words = ["Partner", "Ally", "Guide", "Support", "Assistant"];

  return (
    <div>
      <main>
        <section id="Home" />

        <section id="filter">
          <div className="container">
            <header className="subTitle text-center fs-2 fw-bolder mt-4">
              Find Your Dream Property
            </header>

            <div className="row row-cols-1 row-cols-md-3 g-5">
              <div className="property-selector">
                <label htmlFor="propertyType" className="filterTitle">
                  Property Type
                </label>

                <div
                  className="form-select"
                  tabIndex={0}
                  onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}
                >
                  <div className="displayed-value">
                    {selectedOption1 || "Please Select"}
                  </div>
                  {isPropertyTypeOpen && (
                    <div className="custom-options" ref={dropdownRef1}>
                      {properties.map((property, index) => (
                        <div
                          key={index}
                          className={`custom-option ${
                            selectedOption1 === property ? "selected" : ""
                          }`}
                          onClick={() =>
                            selectOption(
                              property,
                              setSelectedOption1,
                              setIsPropertyTypeOpen
                            )
                          }
                        >
                          {property}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Location Dropdown */}
              <div className="property-selector">
                <label htmlFor="location" className="filterTitle">
                  Location
                </label>
                <div
                  className="form-select"
                  tabIndex={0}
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                >
                  <div className="displayed-value">
                    {selectedOption2 || "Please Select"}
                  </div>
                  {isLocationOpen && (
                    <div className="custom-options" ref={dropdownRef2}>
                      {locations.map((location, index) => (
                        <div
                          key={index}
                          className={`custom-option ${
                            selectedOption2 === location ? "selected" : ""
                          }`}
                          onClick={() =>
                            selectOption(
                              location,
                              setSelectedOption2,
                              setIsLocationOpen
                            )
                          }
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

                    {/* Price Range Dropdown */}
                    <div className="property-selector">
                      <label htmlFor="priceRange" className="filterTitle">Price Range</label>
                      <div className="form-select" tabIndex={0} onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}>
                        <div className="displayed-value">{selectedOption3 || 'Please Select'}</div>
                        {isPriceRangeOpen && (
                          <div className="custom-options" ref={dropdownRef3}>
                            {priceRanges.map((priceRange, index) => (
                              <div key={index}
                                   className={`custom-option ${selectedOption3 === priceRange ? 'selected' : ''}`}
                                   onClick={() => selectOption(priceRange, setSelectedOption3, setIsPriceRangeOpen)}>
                                {priceRange}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
      
                  <button className="searchButton" type="button" onClick={handleSearchButtonClick}>Search</button>
                </div>
                
              </section>
                <section id="recommendation">
                  {isSearchClicked || cardData.length > 0 ? (
                      <div>
                          <header className="recommendationTitle text-left fs-2 fw-bolder mt-4" style={{ marginBottom: '0.4em' }}>
                              {isSearchClicked ? (cardData.length === 0 ? "No Result Found" : "Filter Result/s") : "Recommendations"}
                          </header>
                          <div className="row row-cols-1 row-cols-md-3 g-5">
                              {(isSearchClicked ? filteredResults : cardData).map((card, index) => (
                                  <div className="col" key={index}>
                                      <CardProperty
                                          propertyId={card.propertyId}
                                          imgSrc={card.imgSrc}
                                          cardTitle={card.cardTitle1}
                                          propertyTitle={card.cardTitle2}
                                          propertyAdd={card.cardText}
                                          roomDetails={card.roomDetails}
                                      />
                                  </div>
                              ))}
                          </div>
                          <br /><br /><br /><br /><br />
                      </div>
                  ) : (
                      <div className="noPropertyPromptText">
                          Currently, no property is available for this section.
                      </div>
                  )}
                </section>

        <section id="info">
          <div className="container">
            <div class="row row-cols-1 row-cols-md-3 g-5">
              <div className="col">
                <div className="contain">
                  <img
                    src="Images/content1.png"
                    class="contextImage"
                    alt="house picture"
                    width="100"
                    height="100"
                  />
                  <h5>Most Properties & Rental</h5>
                  <div className="contextDetails">
                    <p>
                      Discover The Ideal Residence From Our Extensive Selection
                      Of Premier Properties. Embark On Your Journey With Us As
                      We Present The
                      <span className="highlightText">
                        {" "}
                        Best Real Estate Options
                      </span>{" "}
                      In Malaysia, Including{" "}
                      <span className="highlightText">
                        {" "}
                        Stylish Condominiums, Charming Townhouses, Modern
                        Apartments, Majestic Bingalows, And Spacious
                        Semi-Detached Houses
                      </span>
                      , Tailored To Fulfill Your Aspirations.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="contain">
                  <img
                    src="Images/content2.png"
                    class="contextImage"
                    alt="house picture"
                    width="100"
                    height="100"
                  />
                  <h5>House Safe</h5>
                  <div className="contextDetails">
                    <p>
                      Our Dedicated Property Services Are Designed To Ensure A
                      <span className="highlightText">
                        {" "}
                        Safe, Secure, And Seamless Experience For Homeowners Ans
                        Renters
                      </span>{" "}
                      Alike. From{" "}
                      <span className="highlightText">
                        Verified Listings To State-Of-The-Art Security Features
                      </span>
                      , We Provide The Tools And Support You Need To Find Or
                      Lease Properties With Confidence.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="contain">
                  <img
                    src="Images/content3.png"
                    class="contextImage"
                    alt="house picture"
                    width="100"
                    height="100"
                  />
                  <h5>Transparency</h5>
                  <div className="contextDetails">
                    <p>
                      Our Property Website Stands On The Foundation Of
                      Transparency. We Believe That Whether You're Buying,
                      Selling, Or Renting, You Should Have Clear, Accessible
                      Information At Your Fingertips. From Open Listings To
                      Straightforward Pricing And Honest Property Conditions, We
                      <span className="highlightText">
                        {" "}
                        Ensure That What You See Is What You Get.{" "}
                      </span>
                      Navigate Your Property Journey With Us, Where Transparency
                      Isn't Just A promise-It's Our Practice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
        </section>
      </main>
    </div>
  );
};

export default TenantHome;