import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './cardHistory.css';
import downLoad_Icon from '../component/Rental_Icon/download.png';
import downLoad_HoverIcon from '../component/Rental_Icon/download_hover.png';
import Comment_Icon from '../component/Rental_Icon/comment.png';
import Comment_Hover_Icon from '../component/Rental_Icon/comment_hover.png';
import Alert from '../../LandlordPOV/Alert'; 
import axios from 'axios';

const CardRent = ({ listing }) => {

    const { property, leaseStatus, effectiveDate, expireDate, _id: leaseId } = listing;
    const { name, type, location, landlordUsername, coverPhoto } = property;
    const imgSrc = `http://localhost:5000/uploads/${coverPhoto}`;
    const isActive = leaseStatus === 'Active';
    const navigate = useNavigate();

    const [hoveredDownloadIcon, setHoveredDownloadIcon] = useState(false);
    const [hoveredCommentIcon, setHoveredCommentIcon] = useState(false);

    const handleDownloadIconMouseEnter = () => setHoveredDownloadIcon(true);
    const handleDownloadIconMouseLeave = () => setHoveredDownloadIcon(false);
    const handleCommentIconMouseEnter = () => setHoveredCommentIcon(true);
    const handleCommentIconMouseLeave = () => setHoveredCommentIcon(false);

    const handleAlert = () => {
        Alert();
      };
    
    const handleCardClick = () => {
        if (isActive) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            navigate(`/tenantViewPropertyActive/${property._id}`);  
        } else {
            navigate(`/tenantViewProperty/${property._id}`);
        }
    };

    const triggerDownload  = async (event, leaseId) => {
        event.stopPropagation();
        try {
          const token = localStorage.getItem('token');
          console.log("Requesting lease download for ID:", leaseId);
          const response = await axios.get(`/api/leases/download/${leaseId}`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob' 
          });
          console.log("Response:", response); // Log the response for debugging
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'LeaseAgreement.pdf'); // Use a relevant file name
          document.body.appendChild(link);
          link.click();
          link.remove();
          handleAlert();
        } catch (error) {
          console.error("Error downloading the signed lease agreement:", error);
         
        }
      };
    
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const handleCommentClick = (event) => {
        event.stopPropagation();
        window.scrollTo({ top: 0, behavior: "smooth" });
        navigate(`/tenantComment/${landlordUsername}`);
    };

    return (
        <div className={`rentalList_statusCard ${isActive ? 'active' : 'expired'}`} onClick={handleCardClick}>
            <div className="history-listing">
                <div className="rentalHistory-image">
                    <img src={imgSrc} alt="Rental Property" />
                </div>
                <div className="rentalHistory-details">
                    <h2 className="rental_historyTitle">{name}</h2>
                    <p className="descript_rental">{location} | {type} rented out by {landlordUsername}</p>
                     <p className="descript_duration">Duration: {formatDate(effectiveDate)} - {formatDate(expireDate)}</p>
                </div>
                <div className="property-actions">
                    {isActive ? (
                        <button className="view-agreement-btn">Active</button>
                    ) : (
                        <button className="expired-btn">Expired</button>
                    )}
                </div>
                <div className="contact-icons">
                    <img 
                        className="rentalTenant-download"
                        src={hoveredDownloadIcon ? downLoad_HoverIcon : downLoad_Icon}
                        onMouseEnter={handleDownloadIconMouseEnter}
                        onMouseLeave={handleDownloadIconMouseLeave}
                        onClick={(event) => triggerDownload(event, leaseId)}
                        alt="Download"
                    />
                    <div
                        className="rentalTenant-link"
                        onClick={handleCommentClick}
                    >
                        <img
                            className="rentalTenant-comment"
                            src={hoveredCommentIcon ? Comment_Hover_Icon : Comment_Icon}
                            onMouseEnter={handleCommentIconMouseEnter}
                            onMouseLeave={handleCommentIconMouseLeave}
                            alt="Comment"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardRent;