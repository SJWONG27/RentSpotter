import React, { useState, useEffect } from "react";
import { Link, useLocation ,useNavigate } from "react-router-dom";
import "../GeneralPage/navbar.css";

const TenantNavbar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("Property");
  const [isLogOut, setIsLogOut] = useState(false);
  const navigate = useNavigate();

  console.log('Current Path:', location.pathname); 

  useEffect(() => {
  if (
      location.pathname.includes('/tenantViewPropertyActive')
  ) {
      
  } else if (
      location.pathname.includes('/tenantApplication') ||
      location.pathname.includes('/tenantViewPropertyLease') ||
      location.pathname.includes('/tenantViewPropertyPending') ||
      location.pathname.includes('/tenantViewPropertyRejected') ||
      location.pathname.includes('/tenantApplyForm')
  )   {
        setActiveItem('Application');
  } else if (
      location.pathname.includes('/tenantHome') ||
      location.pathname.includes('/tenantViewProperty')
  )  {
        setActiveItem('Property');
  } else if (
      location.pathname.includes('/tenantRent') ||
      location.pathname.includes('/tenantComment') 
  )  {
      setActiveItem('Rental History');
  } else if (location.pathname.includes('/tenantProfileEdit')) {
      setActiveItem('Edit Profile');
  } else if (
      location.pathname.includes('/tenantLeaseAgreementHome') ||
      location.pathname.includes('/tenantLeaseAgreementForm') ||
      location.pathname.includes('/tenantLeaseAgreementPg1') ||
      location.pathname.includes('/tenantLeaseAgreementPg2') ||
      location.pathname.includes('/tenantLeaseAgreementPg3') ||
      location.pathname.includes('/tenantLeaseAgreementLastPg')||
      location.pathname.includes('/tenantViewAgreement')
  ) {
      setActiveItem('Lease Agreement');
  } else {
      setActiveItem('');
  }
}, [location.pathname]);

    useEffect(() => {
      if (isLogOut) {
        console.log("Navigating to home...");
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

      setTimeout(() => {
        console.log("Username and token have been removed");
      }, 1000);
      
      setIsLogOut(true); // Set the logout flag to trigger redirection
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
              <li
                className={`nav-item ${
                  activeItem === "Property" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link"
                  to="/tenantHome"
                  onClick={() => handleItemClick("Property")}
                >
                  Property
                </Link>
              </li>
              <li
                className={`nav-item ${
                  activeItem === "Application" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link"
                  to="/tenantApplication"
                  onClick={() => handleItemClick("Application")}
                >
                  Application
                </Link>
              </li>
              <li
                className={`nav-item ${
                  activeItem === "Lease Agreement" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link"
                  to="/tenantLeaseAgreementHome"
                  onClick={() => handleItemClick("Lease Agreement")}
                >
                  Lease Agreement
                </Link>
              </li>
              <li
                className={`nav-item ${
                  activeItem === "Rental History" ? "active" : ""
                }`}
              >
                <Link
                  className="nav-link"
                  to="/tenantRent"
                  onClick={() => handleItemClick("Rental History")}
                >
                  Rental History
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li 
                className={`nav-item ${
                    activeItem === "Edit Profile" ? "active" : ""
                }`}>
                <Link 
                  className="nav-link"
                  to="/tenantProfileEdit" 
                  onClick={() => handleItemClick("Edit Profile")}>
                  Edit Profile
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link" style={{ marginRight: "1.9em" }} onClick={handleLogout}>Log Out</button>
              </li>
            </ul>
          </div>
          <a href="/tenantProfileEdit">
            <img
              src="/Images/tenant_Profile.svg"
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

export default TenantNavbar;
