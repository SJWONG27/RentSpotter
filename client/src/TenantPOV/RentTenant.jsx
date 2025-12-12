import React, { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle';
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';
import CardRent from "./component/CardRent";

const RentTenant = () => {

  const [propertyActionListingInfo, setPropertyActionListingInfo] = useState([]);
  const [propertyExpiredListingInfo, setPropertyExpiredListingInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      
      async function fetchLeasesAndProperties() {
        setLoading(true); 
        try {
          const response = await axios.get(`/api/leases/leasesAndProperties/tenant/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const leasesWithProperties = response.data;
          console.log('Fetched Data:', leasesWithProperties);

          const filteredLeases = leasesWithProperties
              .filter(lease => lease.leaseStatus === 'Expired' || lease.leaseStatus === 'Effective')
              .map(lease => ({
                  ...lease,
                  leaseStatus: lease.leaseStatus === 'Effective' ? 'Active' : lease.leaseStatus
              }));

          console.log('Filtered Leases:', filteredLeases);

          const landlordIds = [...new Set(leasesWithProperties.map(lease => lease.property.landlordId))];
          const landlordResponses = await Promise.all(landlordIds.map(id => axios.get(`/api/users/${id}`)));
          const landlords = landlordResponses.reduce((acc, curr) => {
            acc[curr.data.data._id] = curr.data.data.username; // Updated to access data properly
            return acc;
          }, {});

          const enrichLeasesWithLandlord = (leases) => {
            return leases.map(lease => ({
              ...lease,
              property: {
                ...lease.property,
                landlordUsername: landlords[lease.property.landlordId]
              }
            }));
          };

          setPropertyActionListingInfo(enrichLeasesWithLandlord(filteredLeases.filter(lease => lease.leaseStatus === 'Active')));
          setPropertyExpiredListingInfo(enrichLeasesWithLandlord(filteredLeases.filter(lease => lease.leaseStatus === 'Expired')));
        } catch (err) {
          console.error("Error fetching leases and properties:", err);
          setError("Failed to fetch leases and properties");
        } finally {
          setLoading(false);
        }
      }
      fetchLeasesAndProperties();
    }
  }, []);

  return (
    <main>
      <div className="rental-history">
        <h1 className="rentalTitle">Rental History</h1>
        {loading ? (
           <h3 className="applicationPromptTitle">Loading...</h3>
        ) : (
          <>
            {propertyActionListingInfo.length === 0 && propertyExpiredListingInfo.length === 0 ? (
              <p className="applicationPromptTitle">No Any Rental History</p>
            ) : (
              <>
                {propertyActionListingInfo.length > 0 && (
                  <div className="Rental-Card">
                    <h2 className="cardRental_subtitle">Active</h2>
                    {propertyActionListingInfo.map((listing, index) => (
                      <CardRent key={index} listing={listing} />
                    ))}
                  </div>
                )}
                {propertyExpiredListingInfo.length > 0 && (
                  <div className="Rental-Card">
                    <h2 className="cardRental_subtitle">Expired</h2>
                    {propertyExpiredListingInfo.map((listing, index) => (
                      <CardRent key={index} listing={listing} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default RentTenant;