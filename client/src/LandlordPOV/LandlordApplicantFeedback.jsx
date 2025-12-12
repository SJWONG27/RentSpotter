import Swal from "sweetalert2";
import contactIcon from "./Rental_Icon/contact.png";
import CommentBox from "./component/CommentBox";
import AverageRating from "./component/AverageRating";
import "./landlordApplicantFeedback.css";
import './landlordviewproperty.css';
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from "date-fns";

const LandlordApplicantFeedback = () => {
  
  const location = useLocation();
  const nav = useNavigate();
  const { username, leaseId, applicationId } = location.state || {};
  const [effectiveLeasesCount, setEffectiveLeasesCount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [overallRating, setOverallRating] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [userNameList, setUserNameList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTenantIdByUsername = async (username) => {
    try {
        const response = await axios.get(`/api/username/${username}/tenantId`);
        return response.data.tenantId;
    } catch (error) {
        console.error("Error fetching tenantId:", error);
        throw error;
    }
  };

  useEffect(() => {
    async function fetchLandlordRatingAndComments() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("No token found");
            }

            const tenantId = await fetchTenantIdByUsername(username);

            const landlordResponse = await axios.get(`/api/landlord/tenant/${tenantId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOverallRating(landlordResponse.data.overallRating);
            setPhoneNumber(landlordResponse.data.phonenumber);

            const commentResponse = await axios.get(`/api/landlord/tenantReview/${tenantId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCommentList(commentResponse.data);
        } catch (err) {
            console.error("Error fetching landlord rating and comments:", err);
            Swal.fire({
                text: "Error fetching landlord rating and comments. Please try again later.",
                icon: "error",
                confirmButtonColor: "#FF8C22",
            });
        } finally {
            setLoading(false);
        }
    }

    if (username) {
        fetchLandlordRatingAndComments();
    }
  }, [username]);

  useEffect(() => {
    async function fetchLeases() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(`/api/leases/tenant/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const effectiveLeases = response.data.filter(lease => lease.leaseStatus === 'Effective');
        setEffectiveLeasesCount(effectiveLeases.length);
      } catch (err) {
        console.error("Error fetching leases:", err);
        Swal.fire({
          text: "Error fetching leases. Please try again later.",
          icon: "error",
          confirmButtonColor: "#FF8C22",
        });
      }
    }
    fetchLeases();
  }, [username]);

  useEffect(() => {
    async function fetchUsername() {
      try {
        if (commentList.length === 0) {
          return;
        }
        const promises = commentList.map(async (comment) => {
          const response = await axios.get(`/api/landlord/landlordProperties/${comment.landlordId}`);
          return { usernameComment: response.data.username };
        });

        const usernameData = await Promise.all(promises);
        setUserNameList(usernameData);
      } catch (err) {
        console.error("Error fetching tenant data:", err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load tenant data!',
          confirmButtonColor: "#FF8C22",
        });
      }
    }
    fetchUsername();
  }, [commentList]);

  const handleSendLease = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    nav(`/landlordLeaseAgreementForm/${applicationId}`);
  };

  const handleRejectApplicant = async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const response = await axios.post(
      `/api/leaseAgreement/rejectApplication/${applicationId}`
    );
    setTimeout(() => {
      Swal.fire({
        text: "Reject Successfully",
        icon: "success",
        confirmButtonColor: "#FF8C22",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: 'my-confirm-button-class-success'
      }
      }).then((result) => {
        if (result.isConfirmed) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          nav(`/landlordApplicant`);
        }
      });
    }, 100); // Delay to ensure the scroll completes before showing the dialog
  };


  const formatPhoneNumber = (phone) => {
    return phone.startsWith("6") ? phone : `6${phone}`;
  };

  return (
    <>
      <div className="rental-history applicantReviewDetails">
        <h1 className="EditTitle">Applicant's Review</h1>
        <div className="applicantInfoContainer">
          <div className="applicantInfoSection">
            <div className="profileSection">
              <div className="pictureLeft_Section">
                <img
                  src="Images/Edit_Property_TenantProfile.png"
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

            <div className="applicantContactSection">
              <div className="contactTop_Section">
                <img
                  src={contactIcon}
                  alt="Contact Icon"
                  height={55}
                  width={55}
                  className="contactIcon"
                />
                <p className="contactText">
                  Contact me{" "}
                  <span className="contactLink">
                    <a
                      href={`https://wa.me/${formatPhoneNumber(phoneNumber)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      HERE
                    </a>
                  </span>
                </p>
              </div>

              <div className="contactBottom_Section">
                <div className="avgRatingGroup">
                {commentList.length > 0 && <AverageRating numOfReview={commentList.length} avg={overallRating} />}
                </div>
              </div>
            </div>
          </div>

          <div className="landlordAction_Section">
            <button id="rejectApplicant" onClick={handleRejectApplicant}>
              Reject
            </button>
            <button id="sendLeaseAgreement" onClick={handleSendLease}>
              Send Lease Agreement
            </button>
          </div>
        </div>
        <h2 className="applicantCommentTitle">{commentList.length} Comments</h2>
        <div id="lineWrapper">
          <hr></hr>
        </div>
        <div className="comment-grid">
          {loading ? (
            <h3 className="Loading_Text">Loading...</h3>
          ) : (
            <>
              {commentList.length > 0 ? (
                commentList.map((comment, index) => (
                  <CommentBox
                    key={index}
                    username={userNameList[index]?.usernameComment || "Anonymous"}
                    date={format(new Date(comment.commentDate), 'dd MMMM yyyy')}
                    comment={comment.commentTenant}
                    rating={comment.tenantRating}
                  />
                ))
              ) : (
                <h3 className="Landlord_commentPromptTitle" >No comments available.</h3>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LandlordApplicantFeedback;