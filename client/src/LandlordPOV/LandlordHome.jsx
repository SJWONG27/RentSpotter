import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/js/bootstrap.bundle';
import '../LandlordPOV/landlordhome.css';
import '../GeneralPage/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import CardPropertyLandlord from "../component/CardPropertyLandlord";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FlipWords } from "../LandlordPOV/components/ui/flip-words"; // need to install "npm i framer-motion clsx tailwind-merge"
import { CardBody, CardContainer, CardItem } from "../LandlordPOV/components/ui/3d-card"; // need to install "npm i framer-motion clsx tailwind-merge"


const LandlordHome = () => {
  
  const [propertyList, setPropertyList] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [locations, setLocations] = useState(["All Location"]);

  const navigate = useNavigate();

  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  const [selectedOption3, setSelectedOption3] = useState(null);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [landlordId, setLandlordId] = useState("");

  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = useState(false);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const dropdownRef3 = useRef(null);

  const properties = ["All Properties Type", "Condo", "Commercial", "Landed", "Room"];
  const priceRanges = ["All Price Range", "RM 500 Below", "RM 500 - RM 1000", "RM 1001 - RM 1500", "RM 1501 - RM 2000", "RM 2001 - RM 2500", "RM 2500 Above"];

  const words = ["In Just A Moment", "Very Soon", "Effortlessly", "Without Hassle"];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setLandlordId(decodedToken.userId);

      async function fetchProperties() {
        try {
          const response = await axios.get(`/api/properties/user/${decodedToken.userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (Array.isArray(response.data)) {
            setPropertyList(response.data);
          } else {
            console.error("Fetched data is not an array:", response.data);
          }
        } catch (err) {
          console.error("Error fetching properties:", err);
        }
      }
      fetchProperties();
    }
  }, []);

  useEffect(() => {
    if (propertyList.length > 0) {
      const mappedCardData = propertyList.map((property) => ({
        propertyId: property._id,
        imgSrc: `http://localhost:5000/uploads/${property.coverPhoto}`,
        cardTitle1: `RM ${property.price} Per Month`,
        cardTitle2: property.name,
        cardText: property.address,
        roomDetails: [property.bedroom.toString(), property.bathroom.toString(), `${property.buildUpSize}sf`],
        propertyType: property.type,
        location: property.location,
        priceRange: determinePriceRange(property.price),
      }));
      setCardData(mappedCardData);

      const uniqueLocations = [...new Set(propertyList.map((property) => property.location))];
      setLocations(["All Location", ...uniqueLocations]);
    }
  }, [propertyList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
        setIsPropertyTypeOpen(false);
      }
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
      const matchesType = selectedOption1 === "All Properties Type" || !selectedOption1 || card.propertyType === selectedOption1;
      const matchesLocation = selectedOption2 === "All Location" || !selectedOption2 || card.location === selectedOption2;
      const matchesPriceRange = selectedOption3 === "All Price Range" || !selectedOption3 || card.priceRange === selectedOption3;
      const matchesSearchQuery = !searchQuery || card.cardTitle2.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesLocation && matchesPriceRange && matchesSearchQuery;
    });
    setFilteredResults(results);
  };

  const selectOption = (option, setter, refSetter) => {
    setter(option);
    refSetter(false);
  };

  return (
    <div>
      <main>
        <section id="landlordHome">
          <div className="container">
            <div className="row" id="landlordMain">
              <div className="col">
                <div className="container" id="homeTitle">
                  <div className="row">
                  <p className="display-4 fw-bolder mt-5" style={{ display: 'flex', alignItems: 'center' }}>
                        Find Your Uploaded Property <span id="text"><FlipWords words={words} /></span>
                        <br />
                      </p>
                  </div>
                  <div className="row" id="filter_location">
                    <div className="col" id="state_search_find">
                      <div className="form-select-landlordhome" tabIndex={0} onClick={() => setIsLocationOpen(!isLocationOpen)}>
                        <div className="displayed-value">{selectedOption2 || 'All Location'}</div>
                        {isLocationOpen && (
                          <div className="custom-options-landlordhome" ref={dropdownRef2}>
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
                      <br></br>
                    </div>
                    <div className="col" id="filter_residential">
                      <div className="form-select-landlordhome" tabIndex={0} onClick={() => setIsPropertyTypeOpen(!isPropertyTypeOpen)}>
                        <div className="displayed-value">{selectedOption1 || 'All Properties Type'}</div>
                        {isPropertyTypeOpen && (
                          <div className="custom-options-landlordhome" ref={dropdownRef1}>
                            {properties.map((property, index) => (
                              <div key={index}
                                className={`custom-option ${selectedOption1 === property ? 'selected' : ''}`}
                                onClick={() => selectOption(property, setSelectedOption1, setIsPropertyTypeOpen)}>
                                {property}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <br></br>
                    </div>
                    <div className="col" id="filter_pricerange">
                      <div className="form-select-landlordhome" tabIndex={0} onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}>
                        <div className="displayed-value">{selectedOption3 || 'All Price Range'}</div>
                        {isPriceRangeOpen && (
                          <div className="custom-options-landlordhome" ref={dropdownRef3}>
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
                      <br></br>
                    </div>
                  </div>
                  <div className="col-landlordhome" id="searchFilter">
                    <div id="searchIcon">
                      <FontAwesomeIcon icon={faSearch} />
                    </div>
                    <input type="search" name="searchProperty" id="searchProperty" placeholder="Search By Your Property Name" value={searchQuery} onChange={handleSearchInputChange} />
                  </div>
                  <br></br>
                  <div className="col-landlordhome" id="find">
                    <button id="findButton" type="button" onClick={handleSearchButtonClick}>Find</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="recommendation">
          <header className="recommendationTitle text-left fs-2 fw-bolder mt-4" style={{ marginBottom: '0.4em' }}>
            {isSearchClicked ? (filteredResults.length === 0 ? "No Result Found" : "Filter Result/s") : "Your Property/s"}
          </header>
          <div className="row row-cols-1 row-cols-md-3 g-5">
            {(isSearchClicked ? filteredResults : cardData).map((card, index) => (
              <div className="col" key={index}>
                <CardPropertyLandlord
                  propertyId={card.propertyId}
                  imgSrc={card.imgSrc}
                  cardTitle={card.cardTitle1}
                  propertyTitle={card.cardTitle2}
                  propertyAdd={card.cardText}
                  roomDetails={card.roomDetails}
                />
              </div>  
            ))}
            <div className="col" onClick={() => {
              navigate(`/landlordUploadProperty/${landlordId}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              <CardContainer className="card_Container">
              <CardBody className="card h-100">
              <CardItem >
                <img src="Images/plus.png" className="card-img-top" alt="upload" height={295} />
                </CardItem>
                <CardItem  className="card-body">
                  <h4 className="card-title1">Upload Your Property Details <span id="hoverText">Now</span></h4>
                  <div className="uploadButton" translateZ="60">
                    <a href="#"><button id="upload" type="button">Upload</button></a>
                  </div>
                </CardItem>
                </CardBody>
              </CardContainer>
            </div>
          </div>  
        </section>
        <br /><br /><br />
      </main>
    </div>
  );
};

export default LandlordHome;
