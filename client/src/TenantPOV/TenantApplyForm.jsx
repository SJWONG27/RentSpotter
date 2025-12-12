import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../TenantPOV/edittenantprofile.css";
import "../LandlordPOV/landlord_history.css";
import Swal from "sweetalert2";
import axios from 'axios';

const TenantApplyForm = () => {
    const nav = useNavigate();
    const { propertyId, userId, landlordId } = useParams();

    const [userData, setUserData] = useState({
      editFullname: '',
      editUsername: '',
      editPhoneno: '',
      editEmail: '', 
      editIC: '', 
    });
    
    const [clicked, setClicked] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');  
        try {
          const response = await axios.get(`/api/applications/tenantApplyForm/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const { username, email, phonenumber, fullname, ic } = response.data;
          setUserData({
              editUsername: username,
              editEmail: email,
              editPhoneno: phonenumber,
              editFullname: fullname,
              editIC: ic,
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to load profile data!',
            confirmButtonColor: "#FF8C22",
              customClass: {
                  confirmButton: 'my-confirm-button-class'
              }
          });
        }
      }
      fetchUserData();
    }, [userId]);

    const handleCheckboxChange = () => {
      setClicked(!clicked); 
    };

    const handleSaveAndSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = {};

      // Validate each field
      if (!userData.editUsername?.trim()) {
          validationErrors.editUsername = "*username is required";
      }
      if (!userData.editEmail?.trim()) {
          validationErrors.editEmail = "*email is required";
      } else if (!/\S+@\S+\.\S+/.test(userData.editEmail)) {
          validationErrors.editEmail = "*email is invalid";
      }
      if (!userData.editPhoneno?.trim()) {
          validationErrors.editPhoneno = "*Phone number is required";
      } else if (!/^\d{10,11}$/.test(userData.editPhoneno)) {
          validationErrors.editPhoneno = "*Phone number is invalid";
      }
      if (!userData.editFullname?.trim()) {
          validationErrors.editFullname = "*Fullname is required";
      }
      if (!userData.editIC?.trim()) {
          validationErrors.editIC = "*IC is required";
      }
      if (!clicked) {
          validationErrors.editCheckBox = "*Confirmation is required";
          Swal.fire({
              text: "Confirmation is required!",
              icon: 'warning',
              confirmButtonColor: "#FF8C22",
              customClass: {
                  confirmButton: 'my-confirm-button-class'
              }
          });
      }

      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        const token = localStorage.getItem('token');
        try {
          // Check if the application already exists
          const checkResponse = await axios.get(`/api/applications/tenantApplyForm/${userId}/${propertyId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
    
          if (checkResponse.data.exists) {
            Swal.fire({
              text: "You have already applied for this property.",
              icon: "warning",
              confirmButtonColor: "#FF8C22",
              customClass: {
                confirmButton: 'my-confirm-button-class'
              }
            }).then((result) => {
              if (result.isConfirmed) {
                nav("/tenantApplication");
              }
            });
            return;
          } else {
            // Update profile
            await axios.put('/api/auth/landlordProfileEdit', userData, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
    
            // Create application
            await axios.post(`/api/applications/tenantApplyForm`, {
              userId: userId,
              propertyId: propertyId,
              landlordId: landlordId
            }, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
    
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
              Swal.fire({
                text: "Saved and Submitted!",
                icon: "success",
                confirmButtonColor: "#FF8C22",
                customClass: {
                  confirmButton: 'my-confirm-button-class'
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  nav("/tenantApplication");
                }
              });
            }, 100);
          }
        } catch (error) {
          console.error("Failed to update profile or create application:", error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            confirmButtonColor: "#FF8C22"
          });
        }
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      console.log("Edit value: ", name, value)
      setUserData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
    
    return(
      <>
      <div className="pageMainContainer">

          <h1 className="pageMainTitle">Edit Personal Details</h1>

      <h3 className="pageMainSubTitle">
        Please make sure personal details are correct before proceed.
      </h3>

      <div className="editLandlordForm">
        <div className="row" id="row2">
          <div className="col">
            <h6>FullName *</h6>
            <input
              type="text"
              name="editFullname"
              id="editFullname"
              placeholder="Enter Your FullName Stated in MyKad"
              required
              value={userData.editFullname}
              onChange={handleChange}
            />
            <div className="displayErrorEditMessage">
                {errors.editFullname && <span>{errors.editFullname}</span>}
            </div>
          </div>
          <div className="col">
            <h6>UserName *</h6>
            <input
              type="text"
              name="editUsername"
              id="editUsername"
              placeholder="Enter Your Username"
              required
              value={userData.editUsername}
              onChange={handleChange}
            />
            <div className="displayErrorEditMessage">
              {errors.editUsername && <span>{errors.editUsername}</span>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>NRIC *</h6>
            <input
              type="text"
              name="editIC"
              id="editIC"
              placeholder="Enter Your IC Number"
              required
              pattern="[0-9]{12}"
              value={userData.editIC}
              onChange={handleChange}
            />
            <div className="displayErrorEditMessage">
              {errors.editIC && <span>{errors.editIC}</span>}
            </div>
          </div>
          <div className="col">
            <h6>Phone Number *</h6>
            <input
              type="tel"
              name="editPhoneno"
              id="editPhoneno"
              placeholder="Enter Your Phone Number"
              required
              pattern="[0-9]{3}-[0-9]{7,8}"
              value={userData.editPhoneno}
              onChange={handleChange}
            />
             <div className="displayErrorEditMessage">
              {errors.editPhoneno && <span>{errors.editPhoneno}</span>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <h6>Email Address *</h6>
            <input
              type="email"
              name="editEmail"
              id="editEmail"
              placeholder="Enter Your Email Address"
              required
              value={userData.editEmail}
              onChange={handleChange}
            />
            <div className="displayErrorEditMessage">
              {errors.editEmail && <span>{errors.editEmail}</span>}
            </div>
          </div>

          <div className="col">
            <div className="col"></div>
          </div>
        </div>

        <div className="row">
            <div className="row-checkbox">
              <input
                type="checkbox"
                id="confirmCheckbox"
                checked={clicked}
                onChange={handleCheckboxChange}
                className="checkbox"
              />
              <label htmlFor="confirmCheckbox">
                I hereby confirm the information is true and allow my information
                to be shared with this property's landlord.
              </label>
            </div>

            <div className="displayErrorEditMessage" style={{marginTop: -20 + 'px'}}>
                {errors.editCheckBox && <span>{errors.editCheckBox}</span>}
            </div>
        </div>
      </div>

      <div className="mainCentreButton" style={{marginTop: -50 + 'px'}}>
        <button
          id="submitEdirProfileInfoBtn"
          onClick={handleSaveAndSubmit}
          type="submit"
        >
          Save & Submit
        </button>
      </div>
    </div>
  </>
);
};

export default TenantApplyForm;