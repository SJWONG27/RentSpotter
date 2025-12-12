import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../TenantPOV/edittenantprofile.css";
import "../LandlordPOV/landlord_history.css";
import greyCircle from "./Images/greyCircle.png";
import orangeCircle from "./Images/orangeCircle.png";
import landed from "./Images/landed.svg";
import condo from "./Images/condo.svg";
import commercial from "./Images/commercial.svg";
import room from "./Images/room.svg";
import "./updateproperty.css";


const UpdateProperty = () => {
  const [selected, setSelected] = useState(null);
  const [selectedBedroom, setSelectedBedroom] = useState("");
  const [selectedBathroom, setSelectedBathroom] = useState("");
  const [selectedFurnish, setSelectedFurnish] = useState("");
  const [selectedParking, setSelectedParking] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const nav = useNavigate();
  const { propertyId } = useParams();

  const [formData, setFormData] = useState({
    editPropertyName: "",
    editAddress: "",
    editPostcode: "",
    editLocation: "",
    editSize: "",
    editFac: "",
    editAccesibility: "",
    editDesc: "",
    editPrice: "",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`/api/landlord/landlordViewProperty/${propertyId}`);
        const propertyData = response.data;
        console.log('Response data:', response.data);
        setSelected(propertyData.type); 
        setSelectedBedroom(propertyData.bedroom);
        setSelectedBathroom(propertyData.bathroom);
        setSelectedFurnish(propertyData.furnishing);
        setSelectedParking(propertyData.parking);
        setSelectedFloor(propertyData.floorLevel);
        
        // Set entire formData object
        setFormData({
          editPropertyName: propertyData.name || "",
          editAddress: propertyData.address || "",
          editPostcode: propertyData.postcode || "",
          editLocation: propertyData.location || "",
          editSize: propertyData.buildUpSize || "",
          editFac: propertyData.facilities || "",
          editAccesibility: propertyData.accessibility || "",
          editDesc: propertyData.description || "",
          editPrice: propertyData.price || "",
        });
      } catch (error) {
        console.error('Error fetching property data:', error);
      }
    };
    fetchProperty();
  }, [propertyId]);
  
  

  const [errors, setErrors] = useState({});

  const handleDropdownBedroomChange = (event) => {
    setSelectedBedroom(event.target.value);
  };

  const handleDropdownBathroomChange = (event) => {
    setSelectedBathroom(event.target.value);
  };

  const handleDropdownFurnishChange = (event) => {
    setSelectedFurnish(event.target.value);
  };

  const handleDropdownParkingChange = (event) => {
    setSelectedParking(event.target.value);
  };

  const handleDropdownFloorChange = (event) => {
    setSelectedFloor(event.target.value);
  };

  const handleSelect = (index) => {
    setSelected(index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    // Validation
    if (!formData.editPropertyName) validationErrors.editPropertyName = "*Property name is required.";
    if (!formData.editAddress) validationErrors.editAddress = "*Address is required.";
    if (!formData.editPostcode || formData.editPostcode.length !== 5 || !/^\d+$/.test(formData.editPostcode)) validationErrors.editPostcode = "*Postcode must be 5 digits.";
    if (!formData.editLocation) validationErrors.editLocation = "*Location is required.";
    if (!selectedBedroom) validationErrors.editBedroom = "*Number of bedrooms is required.";
    if (!selectedBathroom) validationErrors.editBathroom = "*Number of bathrooms is required.";
    if (!selectedFurnish) validationErrors.editFurnish = "*Furnishing type is required.";
    if (!selectedParking) validationErrors.editParking = "*Number of parking spaces is required.";
    if (!selectedFloor) validationErrors.editFloor = "*Floor level is required.";
    if (!formData.editSize) {
      validationErrors.editSize = "*Build-up size is required.";
    } else if (!Number.isInteger(Number(formData.editSize))) {
      validationErrors.editSize = "*Build-up size in integer number only.";
    }
    if (!formData.editFac) validationErrors.editFac = "*Facilities are required.";
    if (!formData.editAccesibility) validationErrors.editAccesibility = "*Accessibility is required.";
    if (!formData.editDesc) validationErrors.editDesc = "*Description is required.";
    if (!formData.editPrice) validationErrors.editPrice = "*Price is required.";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const token = localStorage.getItem('token');
      console.log("FormData:", formData);
      console.log("Token:", token);
      try {
        const response = await axios.put(
          `/api/landlord/properties/update/${propertyId}`,
          {
            name: formData.editPropertyName,
            address: formData.editAddress,
            postcode: formData.editPostcode,
            location: formData.editLocation,
            buildUpSize: formData.editSize,
            facilities: formData.editFac,
            accessibility: formData.editAccesibility,
            description: formData.editDesc,
            price: formData.editPrice,
            type: selected,
            bedroom: selectedBedroom,
            bathroom: selectedBathroom,
            furnishing: selectedFurnish,
            parking: selectedParking,
            floorLevel: selectedFloor,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
          console.log("Saved property info successfully.")
          console.log("Updated FormData:", response.data);
          nav(`/landlordEditPhoto/${propertyId}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        
      } catch (error) {
        console.error("Error updating property:", error);
      }
    } else {
      // Scroll to top to show error messages
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  return (
    <div className="pageMainContainer">
      <h1 className="pageMainTitle">Edit Your Properties</h1>

      <h3 className="pageMainSubTitle">Change your property type</h3>

      <div className="image-row">
        <div className="image-container" onClick={() => handleSelect("Landed")}>
          <img src={selected === "Landed" ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={landed} alt="Landed" className="main-image" />
          <p className="label">Landed</p>
        </div>
        <div className="image-container" onClick={() => handleSelect("Condo")}>
          <img src={selected === "Condo" ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={condo} alt="Condo" className="main-image" />
          <p className="label">Condo</p>
        </div>
        <div className="image-container" onClick={() => handleSelect("Commercial")}>
          <img src={selected === "Commercial" ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={commercial} alt="Commercial" className="main-image" />
          <p className="label">Commercial</p>
        </div>
        <div className="image-container" onClick={() => handleSelect("Room")}>
          <img src={selected === "Room" ? orangeCircle : greyCircle} alt="Circle" className="circle-image" />
          <img src={room} alt="Room" className="main-image" />
          <p className="label">Room</p>
        </div>
      </div>
      <div className="editLandlordForm">
        <div className="row" id="row2">
          <div className="col">
            <h6>Property Name</h6>
            <input
              type="text"
              name="editPropertyName"
              id="editPropertyName"
              placeholder="Eg : Tiara Damansara Condomium Unit 315/2, Pandah Indah "
              value={formData.editPropertyName}
              onChange={handleChange}
            />
            <div className="displayErrorEditMessage">
                {errors.editPropertyName && <span>{errors.editPropertyName}</span>}
              </div>
          </div>
          <div className="col">
            <h6>Address</h6>
            <input
              type="text"
              name="editAddress"
              id="editAddress"
              placeholder="Eg :Jalan Perdana 2/8, Pandan Perdana, 55300 Kuala Lumpur"
              value={formData.editAddress}
              onChange={handleChange}
            />
            <div className="displayErrorEditMessage">
                {errors.editAddress && <span>{errors.editAddress}</span>}
              </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h6>Postcode</h6>
            <input
              type="text"
              name="editPostcode"
              id="editPostcode"
              placeholder="Enter Postcode"
              value={formData.editPostcode}
              onChange={handleChange}
            />
            <div className="displayErrorEditMessage">
                {errors.editPostcode && <span>{errors.editPostcode}</span>}
              </div>
          </div>
          <div className="col">
            <h6>Location</h6>
            <input
              type="text"
              name="editLocation"
              id="editLocation"
              placeholder="Eg: Petaling Jaya"
              value={formData.editLocation}
              onChange={handleChange}
            />
            <div className="displayErrorEditMessage">
                {errors.editLocation && <span>{errors.editLocation}</span>}
              </div>
          </div>
        </div>
      </div>
      <div className="editLandlordForm">
      <div className="row" id="row2">
        <div className="col">
          <h6>Bedroom</h6>
          <select value={selectedBedroom} onChange={handleDropdownBedroomChange}>
            <option value="">-- Please Select --</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4 Bedrooms</option>
            <option value="5">5 Bedrooms</option>
            <option value="More than 5">More than 5</option>
          </select>
          <div className="displayErrorEditMessage">
                {errors.editBedroom && <span>{errors.editBedroom}</span>}
              </div>
        </div>
        <div className="col">
          <h6>Bathroom</h6>
          <select value={selectedBathroom} onChange={handleDropdownBathroomChange}>
            <option value="">-- Please Select --</option>
            <option value="1">1 Bathroom</option>
            <option value="2">2 Bathrooms</option>
            <option value="3">3 Bathrooms</option>
            <option value="4">4 Bathrooms</option>
            <option value="More than 4">More than 4</option>
          </select>
          <div className="displayErrorEditMessage">
                {errors.editBathroom && <span>{errors.editBathroom}</span>}
              </div>
        </div>
      </div>
      <div className="row" id="row2">
        <div className="col">
          <h6>Furnishing</h6>
          <select value={selectedFurnish} onChange={handleDropdownFurnishChange}>
            <option value="">-- Please Select --</option>
            <option value="Unfurnished">Unfurnished</option>
            <option value="Partially Furnished">Partially Furnished</option>
            <option value="Fully Furnished">Fully Furnished</option>
          </select>
          <div className="displayErrorEditMessage">
                {errors.editFurnish && <span>{errors.editFurnish}</span>}
              </div>
        </div>
        <div className="col">
          <h6>Parking</h6>
          <select value={selectedParking} onChange={handleDropdownParkingChange}>
            <option value="">-- Please Select --</option>
            <option value="1">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="More than 3">More than 3</option>
          </select>
          <div className="displayErrorEditMessage">
                {errors.editParking && <span>{errors.editParking}</span>}
              </div>
        </div>
      </div>
      <div className="row" id="row2">
        <div className="col">
          <h6>Floor Level</h6>
          <select value={selectedFloor} onChange={handleDropdownFloorChange}>
            <option value="">-- Please Select --</option>
            <option value="Ground Floor">Ground Floor</option>
            <option value="1-5">1-5 Floors</option>
            <option value="6-10">6-10 Floors</option>
            <option value="11-15">11-15 Floors</option>
            <option value="16-20">16-20 Floors</option>
            <option value="21-25">21-25 Floors</option>
            <option value="26-30">26-30 Floors</option>
            <option value="More than 30 Floors">More than 30 Floors</option>
          </select>
          <div className="displayErrorEditMessage">
                {errors.editFloor && <span>{errors.editFloor}</span>}
              </div>
        </div>
        <div className="col">
          <h6>Build-up Size (sq.ft)</h6>
          <input
            type="text"
            name="editSize"
            id="editSize"
            placeholder="Eg: 1200"
            value={formData.editSize}
            onChange={handleChange}
          />
          <div className="displayErrorEditMessage">
                {errors.editSize && <span>{errors.editSize}</span>}
              </div>
        </div>
      </div>
      </div>
      <div className="editLandlordForm">
        <div className="row" id="row2">
          <div className="col">
            <h6>Facilities</h6>
            <input
              type="text"
              name="editFac"
              id="editFac"
              placeholder="Eg: Swimming pool, Gym, Playground"
              value={formData.editFac}
              onChange={handleChange}
            />
            <div className="displayErrorEditMessage">
                {errors.editFac && <span>{errors.editFac}</span>}
              </div>
          </div>
          <div className="col">
            <h6>Accessibility</h6>
            <input
              type="text"
              name="editAccesibility"
              id="editAccesibility"
              placeholder="Eg: Near LRT, MRT, Bus Stop"
              value={formData.editAccesibility}
              onChange={handleChange}
            />
            <div className="displayErrorEditMessage">
                {errors.editAccesibility && <span>{errors.editAccesibility}</span>}
              </div>
          </div>
        </div>
      </div>
      <div className="editLandlordForm">
        <div className="row" id="row2">
          <div className="col">
            <h6>Description</h6>
            <input
              type="text"
              name="editDesc"
              id="editDesc"
              placeholder="Eg: Spacious 3-bedroom condo with modern amenities and a beautiful view"
              value={formData.editDesc}
              onChange={handleChange}
            />
            <div className="displayErrorEditMessage">
                {errors.editDesc && <span>{errors.editDesc}</span>}
              </div>
          </div>
        </div>
      </div>
      <div className="editLandlordForm">
      <div className="row" id="row2">
        <div className="col">
          <h6>Price (RM)</h6>
          <input
            type="text"
            name="editPrice"
            id="editPrice"
            placeholder="Eg: 1500"
            value={formData.editPrice}
            onChange={handleChange}
          />
          <div className="displayErrorEditMessage">
                {errors.editPrice && <span>{errors.editPrice}</span>}
              </div>
        </div>
      </div>
      <div className="applyButton"> 
                    <button className="applyNowButton" type="submit" onClick={handleNext}>Continue</button>
                </div>
      </div>
    </div>
  );
};

export default UpdateProperty;
