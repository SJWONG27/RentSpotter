import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./updateproperty.css";
import "./uploadpropertyphoto.css";
import addFileImage from "./Images/ADDfile.png";

const UploadPropertyPhoto = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const handleImageClick = () => {
    fileInputRef.current.click(); // Trigger file input click
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const token = localStorage.getItem('token');
      console.log("Token:", token);

      try {
        const formData = new FormData();
        formData.append("photo", file);

        const response = await axios.put(`/api/landlord/properties/uploadPhoto/${propertyId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.status === 200) {
          console.log("Photo uploaded successfully:", response.data);
          navigate(`/landlordArrangePhoto/${propertyId}`);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          console.log("Failed to upload photo");
        }
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    } else {
      console.log("Please select a valid image file (jpeg or png)");
    }
  };

  return (
    <div className="pageMainContainer">
      <h1 className="pageMainTitle">Upload Your Properties</h1>

      <h2 className="pageMainSubTitle">
        STEP 2 : UPLOAD YOUR PROPERTY'S PHOTO{" "}
      </h2>

      <div className="containerUploadPhoto">
        <div className="rectangleUploadPhoto">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <img
            src={addFileImage}
            alt="Add File"
            className="image"
            onClick={handleImageClick}
          />
          <p className="boldText">Upload Photo</p>
          <p className="greyText">Upload from your device</p>
        </div>
      </div>
      <div className="additionalInfo">
        <p>Important:</p>
        <ul>1. At least 2 photos required.</ul>
        <ul>2. High-quality photos.</ul>
        <ul>3. Allowed file types: JPEG, TIF, PNG.</ul>
        <ul>4. Photos must be less than 5MB.</ul>
        <ul>5. Do not include any personal details in the photo.</ul>
      </div>
    </div>
  );
};

export default UploadPropertyPhoto;
