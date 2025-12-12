import React, { useState, useEffect } from "react";
import "./tenantapplication.css";
import CardApplication from "./component/CardApplication";
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';
import Swal from "sweetalert2";

const TenantApplication = () => {
  
  const [applicationList, setApplicationList] = useState([]);
  const [propertyActionListingInfo, setPropertyActionListingInfo] = useState([]);
  const [propertyOtherListingInfo, setPropertyOtherListingInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      async function fetchApplication() {
        setLoading(true);
        try {
          const response = await axios.get(`/api/applications/tenantApplication/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log("Applications fetched:", response.data);
          setApplicationList(response.data);
        } catch (err) {
          console.error("Error fetching applications data:", err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to load application data!',
            confirmButtonColor: "#FF8C22"
          });
        } finally {
          setLoading(false);
        }
      }
      fetchApplication();
    }
  }, []);

  useEffect(() => {
    async function fetchPropertyInfo() {
      setLoading(true);
      try {
        const promises = applicationList.map(async (application) => {
          const response = await axios.get(`/api/applications/ViewProperty/${application.propertyId}`);
          console.log("Property fetched for application:", application, response.data);
          return { property: response.data, application };
        });

        const propertyData = await Promise.all(promises);
        console.log("Property Data List:", propertyData);

        const landlordIds = [...new Set(propertyData.map(data => data.property.landlordId))];
        const landlordResponses = await Promise.all(landlordIds.map(id => axios.get(`/api/users/${id}`)));
        const landlords = landlordResponses.reduce((acc, curr) => {
          acc[curr.data.data._id] = curr.data.data.username;
          return acc;
        }, {});

        const enrichedPropertyData = propertyData.map(({ property, application }) => ({
          ...property,
          landlordUsername: landlords[property.landlordId]
        }));

        const actionListings = [];
        const otherListings = [];

        enrichedPropertyData.forEach((property) => {
          const application = applicationList.find(app => app.propertyId === property._id);
          const listing = {
            applicationId: application._id,
            propertyId: application.propertyId,
            title: property.name,
            locationOwner: `${property.location} | ${property.type} rented out by ${property.landlordUsername}`,
            imgSrc: `http://localhost:5000/uploads/${property.coverPhoto}`,
            isViewLease: application.applicationStatus === "Approved",
            isPending: application.applicationStatus === "Pending",
            isRejected: application.applicationStatus === "Rejected",
            bedroom: property.bedroom,
            bathroom: property.bathroom,
            sqft: `${property.buildUpSize} Sqft`,
            price: `RM ${property.price}`
          };

          console.log("Card Data: ", property, application, listing);

          if (application.applicationStatus === "Approved") {
            actionListings.push(listing);
          } else {
            otherListings.push(listing);
          }
        });

        setPropertyActionListingInfo(actionListings);
        setPropertyOtherListingInfo(otherListings);
      } catch (err) {
        console.error("Error fetching property data:", err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load property data!',
          confirmButtonColor: "#FF8C22",
          customClass: {
            confirmButton: 'my-confirm-button-class'
          }
        });
      } finally {
        setLoading(false);
      }
    }

    if (applicationList.length > 0) {
      fetchPropertyInfo();
    } else {
      setPropertyActionListingInfo([]);
      setPropertyOtherListingInfo([]);
    }
  }, [applicationList]);

  const renderContent = () => {
    if (loading) {
      return <h3 className="applicationPromptTitle">Loading...</h3>;
    }
    if (propertyActionListingInfo.length === 0 && propertyOtherListingInfo.length === 0) {
      return <p className="applicationPromptTitle">You have not submitted any application yet! Grab one now!</p>;
    }
    return (
      <>
        {propertyActionListingInfo.length > 0 && (
          <>
            <h2 className="applicationSubTitle">Action Needed</h2>
            {propertyActionListingInfo.map((listing, index) => (
              <CardApplication key={index} listing={listing} />
            ))}
          </>
        )}
        {propertyOtherListingInfo.length > 0 && (
          <>
            <h2 className="applicationSubTitle">Other Application/s</h2>
            {propertyOtherListingInfo.map((listing, index) => (
              <CardApplication key={index} listing={listing} />
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <main>
      <div className="pageMainContainer">
        <h1 className="pageMainTitle">Application History</h1>
        {renderContent()}
      </div>
    </main>
  );
};

export default TenantApplication;