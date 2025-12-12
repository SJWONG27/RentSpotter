import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../GeneralPage/navbar.css";

const LandlordNavbar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const [isLogOut, setIsLogOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/landlordHome') || path.startsWith('/landlordViewProperty') || path.startsWith('/landlordUpdateProperty') || path.startsWith('/landlordEditPhoto') || path.startsWith('/landlordUploadProperty') || path.startsWith('/landlordUploadPropertyPhoto') || path.startsWith('/landlordArrangePhoto')) {
      setActiveItem('YourProperty');
    } else if (path.startsWith('/landlordComment') || path.startsWith('/landlordHistory')) {
      setActiveItem('RentalHistory');
    } else if (path.startsWith('/landlordProfileEdit')) {
      setActiveItem('Edit Profile');
    } else if (path.startsWith('/landlordApplicant') || path.startsWith('/landlordApplicantFeedback') || path.startsWith('/landlordLeaseAgreementForm') || path.startsWith('/landlordLeaseAgreementPg1') || path.startsWith('/landlordLeaseAgreementPg2') || path.startsWith('/landlordLeaseAgreementPg3')) {
      setActiveItem('Applicant');
    } else {
      setActiveItem('');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isLogOut) {
      navigate('/');
    }
  }, [isLogOut, navigate]);

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setIsLogOut(true);
  };

  return (
    <div className="navbarContainer">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <img
            src="/Images/logoText.png"
            alt="Logo"
            width="90"
            height="90"
            style={{ marginLeft: "1.5em" }}
          />
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className={`nav-item ${activeItem === 'YourProperty' ? 'active' : ''}`}>
                <Link
                  className="nav-link"
                  to="/landlordHome"
                  onClick={() => handleItemClick('YourProperty')}
                >
                  Your Property
                </Link>
              </li>
              <li className={`nav-item ${activeItem === 'Applicant' ? 'active' : ''}`}>
                <Link
                  className="nav-link"
                  to="/landlordApplicant"
                  onClick={() => handleItemClick('Applicant')}
                >
                  Applicant
                </Link>
              </li>
              <li className={`nav-item ${activeItem === 'RentalHistory' ? 'active' : ''}`}>
                <Link
                  className="nav-link"
                  to="/landlordHistory"
                  onClick={() => handleItemClick('RentalHistory')}
                >
                  Rental History
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className={`nav-item ${activeItem === 'Edit Profile' ? 'active' : ''}`}>
                <Link
                  className="nav-link"
                  to="/landlordProfileEdit"
                  onClick={() => handleItemClick('Edit Profile')}
                >
                  Edit Profile
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>Log Out</button>
              </li>
            </ul>
          </div>
          <a href="/landlordProfileEdit">
            <img
              src="/Images/landlord_Profile.svg"
              alt="Avatar"
              width="110"
              height="auto"
            />
          </a>
        </div>
      </nav>
    </div>
  );
};

export default LandlordNavbar;