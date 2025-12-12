import React, { useState, useEffect, useRef, useCallback } from 'react';
import './home.css';
import CardGeneral from "../component/CardGeneral";
import 'bootstrap/dist/js/bootstrap.bundle';
import axios from 'axios';

const Commercial = () => {
  
  const [propertyList, setPropertyList] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [locations, setLocations] = useState(["All Location"]);

  const [selectedOption2, setSelectedOption2] = useState(null);
  const [selectedOption3, setSelectedOption3] = useState(null);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);

  const dropdownRef2 = useRef(null);
  const dropdownRef3 = useRef(null);

  const priceRanges = ["All Price Range","RM 500 Below","RM 500 - RM 1000", "RM 1001 - RM 1500", "RM 1501 - RM 2000","RM 2001 - RM 2500","RM 2500 Above"];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/applications/home/commercial'); 
        if (Array.isArray(response.data)) {
          setPropertyList(response.data);
        } else {
          console.log("No an array: ", response.data)
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const setPropertyToCardData = useCallback(() => {
    if (!Array.isArray(propertyList)) {
      console.log("No an array", propertyList)
      return;
    }

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
  }, [propertyList]);

  useEffect(() => {
    if (Array.isArray(propertyList)) {
      setPropertyToCardData();
    }
  }, [propertyList, setPropertyToCardData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
      if (dropdownRef3.current && !dropdownRef3.current.contains(event.target)) {
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
      const matchesLocation =
        selectedOption2 === "All Location" ||
        !selectedOption2 ||
        card.location === selectedOption2;
      const matchesPriceRange =
        selectedOption3 === "All Price Range" ||
        !selectedOption3 ||
        card.priceRange === selectedOption3;
      return matchesLocation && matchesPriceRange;
    });
    setFilteredResults(results);
  };

  const selectOption = (option, setter, refSetter) => {
    setter(option);
    refSetter(false);
  };

  return (
    <div>
      <div className='generalContent'>
        <section id="filter">
            <div className="container">
                <header className="subTitle text-center fs-2 fw-bolder mt-4">
                    Find Your Dream Property
                </header>
                <div className="row row-cols-1 row-cols-md-2 g-5">
                    <div className="property-selector">
                        <label htmlFor="location" className="filterTitle">Location</label>
                        <div className="Specificform-select" tabIndex={0} onClick={() => setIsLocationOpen(!isLocationOpen)}>
                            <div className="displayed-value">{selectedOption2 || 'Please Select'}</div>
                            {isLocationOpen && (
                                <div className="custom-options" ref={dropdownRef2}>
                                    {locations.map((location, index) => (
                                        <div key={index}
                                            className={`custom-option ${selectedOption2 === location ? 'selected' : ''}`}
                                            onClick={() => selectOption(location, setSelectedOption2, setIsLocationOpen)}>
                                            {location}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="property-selector">
                        <label htmlFor="priceRange" className="filterTitle">Price Range</label>
                        <div className="Specificform-select" tabIndex={0} onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}>
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
                                <CardGeneral
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
      </div>
    </div>
  );
};

export default Commercial;