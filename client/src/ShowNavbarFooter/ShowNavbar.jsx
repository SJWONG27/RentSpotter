import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ShowNavBar = ({ children }) => {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    console.log("Navbar: This is location", location);
    if (
      location.pathname === "/signIn" ||
      location.pathname === "/registerLandlordAcc" ||
      location.pathname === "/registerTenantAcc" ||
      location.pathname === "/logIn" ||
      location.pathname.startsWith("/resetPassword") || 
      location.pathname === "/forgotPassword" ||
      location.pathname === "/verifyEmail" ||
      location.pathname === "/fullAgreement" 
    ) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [location]);

  return <div>{showNavbar && children}</div>;
};

export default ShowNavBar;
