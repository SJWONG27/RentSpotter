import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./editlandlordprofile.css";
import "./landlord_history.css";
import Swal from "sweetalert2";
import starDefault from "./Rental_Icon/rating_star_default.svg";
import starOnClick from "./Rental_Icon//rating_star_onClick.svg";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const LandlordComment = () => {
  
  const { username } = useParams();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState(Array(5).fill(false));
  const [effectiveLeasesCount, setEffectiveLeasesCount] = useState(0);
  const [landlordId, setLandlordId] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [comment, setComment] = useState("");
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    async function fetchLeases() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found");
        }

        const decodedToken = jwtDecode(token);
        setLandlordId(decodedToken.userId);

        const response = await axios.get(`/api/leases/tenant/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const effectiveLeases = response.data.filter(lease => lease.leaseStatus === 'Effective');
        setEffectiveLeasesCount(effectiveLeases.length);

        const relevantLeases = response.data.filter(lease => 
          lease.leaseStatus === 'Effective' || lease.leaseStatus === 'Expired'
        );

        if (relevantLeases.length > 0) {
          const tenantId = relevantLeases[0].tenantId;
          setTenantId(tenantId);

          const reviewResponse = await axios.get(`/api/reviewsTenant/${tenantId}`);
          setTotalReviews(reviewResponse.data.totalReviews);
          setAverageRating(reviewResponse.data.averageRating);
        }
      } catch (err) {
        console.error("Error fetching leases:", err);
        Swal.fire({
          text: "Error fetching leases. Please try again later.",
          icon: "error",
          confirmButtonColor: "#FF8C22",
        });
        Swal.fire({
          text: "Error fetching leases. Please try again later.",
          icon: "error",
          confirmButtonColor: "#FF8C22",
        });
      }
    }
    fetchLeases();
  }, [username]);

  
  const handleStarClick = (index) => {
    const newRatings = new Array(ratings.length).fill(false);
    const fillUpTo = ratings[index] && !ratings.some((active, idx) => active && idx > index)
      ? index
      : index + 1;
    for (let i = 0; i < fillUpTo; i++) {
      newRatings[i] = true;
    }
    setRatings(newRatings);
  };

  const handleSaveAndSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const tenantRating = ratings.filter(Boolean).length;

    console.log('tenantId:', tenantId);
    console.log('landlordId:', landlordId);
    console.log('tenantRating:', tenantRating);
    console.log('commentTenant:', comment);

     if (!tenantId || !landlordId || tenantRating === undefined || !comment) {
        console.error("Missing required fields");
        return;
    }


    try {
      await axios.post('/api/reviewsTenant/tenant', {
        tenantId,
        landlordId,
        tenantRating,
        commentTenant: comment,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        text: "Saved and Submitted!",
        icon: "success",
        confirmButtonColor: "#FF8C22",
        customClass: {
          confirmButton: 'my-confirm-button-class',
          image: "my-custom-image-class"
        }
      }).then((result) => {
        if (result.isConfirmed) {
          window.scrollTo({ top: 0, behavior: 'smooth'});
          navigate("/landlordHistory");
        }
      });
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  return (
    <>
      <div className="rental-history">
        <h1 className="rentalTitle">Rate & Comment Your Tenant</h1>

        <div className="profileSection">
          <div className="pictureLeft_Section">
            <img
              src="/Images/Edit_Property_TenantProfile.png"
              alt="Logo"
              width="100"
              height="100"
            />
          </div>

          <div className="accountRight_Section">
            <h5 className="usernameText">{username}</h5>
            <p className="accountDetail" id="accDetails">
              Current Rent Properties: {effectiveLeasesCount}
            </p>
          </div>
        </div>

        <div className="commentForm">
          <h5 className="commenth5">
            Your review is important to help other landlords to find a favorite
            tenant. Feel free to share your feedback with them based on the aspects below.
          </h5>

          <div className="Rate">
            <h3>Rate Your Overall Experience</h3>

            <div className="starAlone">
              {ratings.map((isActive, index) => (
                <img
                  key={index}
                  className="RatingStar_row"
                  src={isActive ? starOnClick : starDefault}
                  alt="Rating Star"
                  width="85"
                  height="85"
                  onClick={() => handleStarClick(index)}
                />
              ))}
            </div>
          </div>

          <div className="comment">
            <div className="line"></div>

            <h3>Additional Comment</h3>

            <div className="additional-form">
              <textarea
                name="additionalComment"
                id="additionalComment"
                rows="5"
                placeholder="You can leave your comment based on timeliness of rent payments, property maintenance and care, communication and responsiveness, adherence to lease terms and neighbor relations."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          <div className="mainCentreButton">
            <button
              id="submitEdirProfileInfoBtn"
              onClick={handleSaveAndSubmit}
              type="submit">
              Save & Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandlordComment;