import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import './viewproperty.css';
import DetailsPanel from "./component/DetailsPanel";
import CommentSection from "./component/CommentSection";
import PropertyStatus from "./component/PropertyStatus";


const ViewPropertyRejected = () => {
    
    const { propertyId } = useParams();

    const [property, setProperty] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [propertyImageSrc, setPropertyImageSrc] = useState([]);
    const [isLandlordIdFetched, setIsFetched] = useState(false);
    const [landlordId, setLandlordId] = useState(null);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`/api/applications/ViewProperty/${propertyId}`); // Adjust the endpoint if necessary
                const propertyData = response.data;
                const baseURL = 'http://localhost:5000/uploads/';
                const images = [propertyData.coverPhoto, ...propertyData.photos].map(photo => `${baseURL}${photo}`);
                setProperty(propertyData);
                setPropertyImageSrc(images);
                setLandlordId(propertyData.landlordId);
                setIsFetched(true);
            } catch (error) {
                console.error('Error fetching property data:', error);
            }
        };
        fetchProperty();
    }, [propertyId]);

    const handlePrevious = () => {
      setCurrentIndex(prevIndex => (prevIndex === 0 ? propertyImageSrc.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
      setCurrentIndex(prevIndex => (prevIndex === propertyImageSrc.length - 1 ? 0 : prevIndex + 1));
    };


  return (
    <div>
      <main>
        <section id="PropertyImage">
          <div className="container">
            <div className="imageContainer">
                <div className="propertyImageContainer">
                    <img src={propertyImageSrc[currentIndex]} alt='propertyImages' className='propertyImage' />
                </div>
                <div className="propertyImageContainer">
                    <img src={propertyImageSrc[(currentIndex + 1) % propertyImageSrc.length]} alt='propertyImages' className='propertyImage' id='propertyImage2' />
                </div>
            </div>
            <div className="buttonContainer">
              <button className="previousButton" onClick={handlePrevious}>
                <svg
                  width="46"
                  height="44"
                  viewBox="0 0 46 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="23"
                    cy="22"
                    rx="23"
                    ry="22"
                    fill="#D9D9D9"
                    fillOpacity="0.66"
                  />
                  <path
                    d="M14 21.5L25.3514 11L28 13.45L19.2973 21.5L28 29.55L25.3514 32L14 21.5Z"
                    fill="#171616"
                    fillOpacity="0.58"
                  />
                </svg>
              </button>
              <button className="nextButton" onClick={handleNext}>
                <svg
                  width="46"
                  height="44"
                  viewBox="0 0 46 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="23"
                    cy="22"
                    rx="23"
                    ry="22"
                    fill="#D9D9D9"
                    fillOpacity="0.66"
                  />
                  <path
                    d="M30 21.5L18.6486 32L16 29.55L24.7027 21.5L16 13.45L18.6486 11L30 21.5Z"
                    fill="#171616"
                    fillOpacity="0.58"
                  />
                </svg>
              </button>
            </div>
            <div className="imgPageIconContainer">
              <div className="imgPageText">{propertyImageSrc.length}</div>
              <svg
                className="imgPageIcon"
                width="27"
                height="21"
                viewBox="0 0 27 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.6252 0H1.12481C0.503551 0 0 0.522316 0 1.16679V17.5H1.68751V1.74998H23.6252V0ZM6.21418 8.74992C6.21418 10.1996 7.34722 11.3749 8.74565 11.3749C10.1437 11.3749 11.2767 10.1996 11.2767 8.74992C11.2767 7.30046 10.1437 6.12494 8.74565 6.12494C7.34722 6.12494 6.21418 7.30046 6.21418 8.74992ZM25.3127 12.3087L21.9565 8.74992L16.4462 14.1285L13.497 11.6028L5.06254 19.2498V5.24995H25.3127V12.3087ZM3.37502 4.66655V19.8332C3.37502 20.4777 3.87858 21 4.50003 21H15.1876H25.8752C26.4964 21 27 20.4777 27 19.8332V4.66655C27 4.02228 26.4964 3.49997 25.8752 3.49997H4.50003C3.87858 3.49997 3.37502 4.02228 3.37502 4.66655Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </section>

                <section id="PropertyDetails">
                    <div className="container"><DetailsPanel property={property} /></div>
                </section>

        <div className="PropertyStatus">
          <PropertyStatus
            text="APPLICATION REJECTED BY LANDLORD"
            backgroundColor="#B90000"
            textColor="#FFFFFF"
          />
        </div>

                {isLandlordIdFetched && <CommentSection landlordId={landlordId} />}
            </main>
        </div>
    );
}

export default ViewPropertyRejected;
