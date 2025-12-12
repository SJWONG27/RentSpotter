import React, { useState, useEffect } from "react";
import "../TenantPOV/edittenantprofile.css";
import "../LandlordPOV/editlandlordprofile.css";
import "../LandlordPOV/landlord_history.css";
import Swal from "sweetalert2";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { getCurrentUser } from "../controllers/authControllers";

const EditTenantProfile = () => {
    const [userData, setUserData] = useState({
        editFullname: '',
        editUsername: '',
        editPhoneno: '',
        editEmail: '', 
        editIC: '', 
    });

    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [errors, setErrors] = useState({})
    const [effectiveLeasesCount, setEffectiveLeasesCount] = useState(0);

    const fetchUserData = () => {
      const token = localStorage.getItem('token');  
      getCurrentUser(token)
      .then(response => {
        const { username, email, phonenumber, fullname, ic } = response.data;
        localStorage.setItem('username', username);
        setUsername(username);
        setUserData({
            editUsername: username,
            editEmail: email,
            editPhoneno: phonenumber,
            editFullname: fullname,
            editIC: ic,
        });
      })
      .catch(error => {
        console.error("Failed to fetch profile:", error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load profile data!',
        });
      });
    };


    const fetchLeases = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found");
        }
  
        const decodedToken = jwtDecode(token);
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
    };
  
    useEffect(() => {
      fetchUserData();
      fetchLeases();
    }, [username]);

    const handleSaveAndSubmit = (e) => {
      e.preventDefault();
      console.log("Check input");
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

      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        const token = localStorage.getItem('token');  
        console.log(userData);
        axios.put('/api/auth/landlordProfileEdit', userData, {
            headers: {
              'Authorization': `Bearer ${token}` 
          }
        })
        .then(response => {
          localStorage.setItem('username', userData.editUsername);
          setUsername(userData.editUsername);
            Swal.fire({
                text: "Profile Updated Successfully!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#FF8C22",
                customClass: {
                  confirmButton: 'my-confirm-button-class-success'
            }
          });
      })
        .catch(error => {
            console.error("Failed to update profile:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        });
    }  
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setUserData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };

  return (
    <>
      <div className="rental-history">
        <h1 className="EditTitle">Your Profile</h1>

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

        <div className="editLandlordForm">
          <div className="row" id="row2">
            <div class="col">
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

            <div class="col">
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
            <div class="col">
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

            <div class="col">
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
            <div class="col">
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

            <div className="col"></div>
          </div>
          <p id="alertMessage">
            ** It is <span>compulsory</span> to fill in all of the above
            information before uploading your property
          </p>

          <div className="mainCentreButton">
            <button
              id="submitEdirProfileInfoBtn"
              onClick={handleSaveAndSubmit}
              type="submit"
            >
              Save & Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTenantProfile;
