import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import "../LandlordPOV/editlandlordprofile.css";
import "../LandlordPOV/landlord_history.css";
import Swal from "sweetalert2";
import starDefault from "../LandlordPOV/Rental_Icon/rating_star_default.svg";
import starOnClick from "../LandlordPOV/Rental_Icon/rating_star_onClick.svg";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const TenantComment = () => {

    const { landlordUsername } = useParams();
    const navigate = useNavigate();
    const [ratings, setRatings] = useState(Array(5).fill(false));
    const [comment, setComment] = useState("");
    const [propertyCount, setPropertyCount] = useState(0);
    const [landlordId, setLandlordId] = useState(null);
    const [tenantId, setTenantId] = useState(null);

    useEffect(() => {
        if (!landlordUsername) {
            console.error("No landlordUsername found in URL");
            return;
        }

        async function fetchLandlordIdAndPropertyCount() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("No token found");
                }

                const decodedToken = jwtDecode(token);
                setTenantId(decodedToken.userId);

                const landlordResponse = await axios.get(`/api/username/${landlordUsername}/landlordId`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
              
                const landlordId = landlordResponse.data.landlordId;
                setLandlordId(landlordId);

                const propertyResponse = await axios.get(`/api/properties/landlord/${landlordId}/propertyCount`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setPropertyCount(propertyResponse.data.propertyCount);
            } catch (err) {
                console.error("Error fetching property count:", err);
                Swal.fire({
                    text: "Error fetching property count. Please try again later.",
                    icon: "error",
                    confirmButtonColor: "#FF8C22",
                });
            }
        }
        fetchLandlordIdAndPropertyCount();
    }, [landlordUsername]);

    const handleStarClick = (index) => {
        const newRatings = new Array(ratings.length).fill(false);
        const fillUpTo = ratings[index] && !ratings.some((active, idx) => active && idx > index) ? index : index + 1;
        for (let i = 0; i < fillUpTo; i++) {
            newRatings[i] = true;
        }
        setRatings(newRatings);
    };

    const handleSaveAndSubmit = async (e) => {
        
        e.preventDefault();
        const token = localStorage.getItem('token');
        const landlordRating = ratings.filter(Boolean).length;
    
        console.log('tenantId:', tenantId);
        console.log('landlordId:', landlordId);
        console.log('landlordRating:', landlordRating);
        console.log('commentLandlord:', comment);

        if (!tenantId || !landlordId || landlordRating === undefined || !comment) {
            console.error("Missing required fields");
            return;
        }

        try {
            await axios.post('/api/reviewsLandlord/landlord', {
              tenantId,
              landlordId,
              landlordRating,
              commentLandlord: comment,
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
                navigate("/tenantRent");
              }
            });
          } catch (error) {
            console.error("Error saving review:", error);
          }
        };
        
    return (
        <div className="rental-history">
            <h1 className="rentalTitle">Rate & Comment Your Landlord</h1>
            <div className="profileSection">
                <div className="pictureLeft_Section">
                    <img src="/Images/Edit_landlord_progile.png" alt="Logo" width="100" height="100" />
                </div>
                <div className="accountRight_Section">
                    <h5 className="usernameText">{landlordUsername}</h5>
                    <p className="accountDetail" id="accDetails">
                        Uploaded Properties: {propertyCount}
                    </p>
                </div>
            </div>
            <div className="commentForm">
                <h5 className="commenth5">Your review is helpful to other tenants. Feel free to share your feedback with them based on below aspects.</h5>
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
                            placeholder="Rate your experience with rent collection, property upkeep, landlord communication, lease compliance, and neighbor relations management."
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <div className="mainCentreButton">
                    <button id="submitEdirProfileInfoBtn" onClick={handleSaveAndSubmit} type="submit">Save & Submit</button>
                </div>
            </div>
        </div>
    );
};

export default TenantComment;