import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "bootstrap/dist/js/bootstrap.bundle";
import "./landlord_history.css";
import DownloadIcon from "./Rental_Icon/download.png";
import CommentIcon from "./Rental_Icon/comment.png";
import DownloadHoverIcon from "./Rental_Icon/download_hover.png";
import CommentHoverIcon from "./Rental_Icon/comment_hover.png";
import Alert from "../LandlordPOV/Alert";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

function LandlordHistory() {

  const [hoveredDownloadIcon, setHoveredDownloadIcon] = useState({});
  const [hoveredCommentIcon, setHoveredCommentIcon] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [leases, setLeases] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
 };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      async function fetchProperties() {
        try {
          const response = await axios.get(`/api/properties/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProperties(response.data);
        } catch (err) {
          console.error("Error fetching properties:", err);
          setError("Failed to fetch properties");
        }
      }
      fetchProperties();
    }
  }, []);


  const handlePropertyChange = (propertyId) => {
    if (!propertyId) {
      setSelectedProperty(null);
      setLeases([]);
    } else {
      const property = properties.find(p => p._id === propertyId);
      setSelectedProperty(property);
      setLeases([]); 
      setLoading(true); 

      async function fetchLeases() {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`/api/leases/${propertyId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const filteredLeases = response.data
            .filter(lease => lease.leaseStatus === 'Expired' || lease.leaseStatus === 'Effective')
            .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate));
          setLeases(filteredLeases);
        } catch (err) {
          console.error("Error fetching leases:", err);
          setError("Failed to fetch leases");
        } finally {
          setLoading(false); 
        }
      }
      fetchLeases();
    }
  };

  const handleDownloadIconMouseEnter = (index) => setHoveredDownloadIcon((prev) => ({ ...prev, [index]: true }));
  const handleDownloadIconMouseLeave = (index) => setHoveredDownloadIcon((prev) => ({ ...prev, [index]: false }));
  const handleCommentIconMouseEnter = (index) => setHoveredCommentIcon((prev) => ({ ...prev, [index]: true }));
  const handleCommentIconMouseLeave = (index) => setHoveredCommentIcon((prev) => ({ ...prev, [index]: false }));

  const handleAlert = () => {
    Alert();
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      setError("Failed to download the signed lease agreement");
    }
  };

  const handleCommentClick = (username) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/landlordComment/${username}`); 
  };

  const renderTable = (data) => (
    <table className="history-table">
      <thead>
        <tr>
          <th>Tenant's Username</th>
          <th>Effective Date</th>
          <th>Lease Agreement Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((lease, index) => (
          <tr key={lease._id}>
            <td>{lease.tenantId.username}</td>
            <td>{formatDate(lease.effectiveDate)} - {formatDate(lease.expireDate)}</td>
            <td>{lease.leaseStatus}</td>
            <td>
              <img
                src={hoveredDownloadIcon[index] ? DownloadHoverIcon : DownloadIcon}
                className="downloadIcon"
                alt="Download Icon"
                onMouseEnter={() => handleDownloadIconMouseEnter(index)}
                onMouseLeave={() => handleDownloadIconMouseLeave(index)}
                onClick={(event) => triggerDownload(event, lease._id)}
                width="29"
                height="29"
              />
              <span
                className="comment_linkIcon"
                onMouseEnter={() => handleCommentIconMouseEnter(index)}
                onMouseLeave={() => handleCommentIconMouseLeave(index)}
                onClick={() => handleCommentClick(lease.tenantId.username)}
              >
                <img
                  src={hoveredCommentIcon[index] ? CommentHoverIcon : CommentIcon}
                  alt="Comment Link"
                  width="29"
                />
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="rental-history">
      <h1 className="rentalTitle">Rental History</h1>
      {error && <p className="error">{error}</p>}
      
      
      <div className="property-selector" ref={dropdownRef}>
        <label htmlFor="property-select">Your Property</label>
        <div
          className="custom-select"
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setIsOpen(false)}
        >
          <div className="displayed-value">
            {selectedProperty ? selectedProperty.name : "Please Select Your Property"}
          </div>
          {isOpen && (
            <div className="custom-options">
              {properties.map(property => (
                <div
                  key={property._id}
                  className={`custom-option ${selectedProperty && selectedProperty._id === property._id ? "selected" : ""}`}
                  onClick={() => {
                    handlePropertyChange(property._id);
                    setIsOpen(false);
                  }}
                >
                  {property.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="property-details">
        {selectedProperty ? (
          loading ? (
            <h3 className="Brief_Text">Loading...</h3>
          ) : leases.length === 0 ? (
            <h3 className="Brief_Text">
              Sorry, this property hasn't been rented out yet, so it{" "}
              <b>doesn't have any rental history</b>. You might review its
              applicants for renting purposes.
            </h3>
          ) : (
            <>
              <h2 className="propertyName">{selectedProperty.name}</h2>
              {renderTable(leases)}
            </>
          )
        ) : null}
      </div>
    </div>
  );
}

export default LandlordHistory;