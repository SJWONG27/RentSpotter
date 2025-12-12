import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ShowFooter = ({ children }) => {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    console.log("Footer: This is location", location);
    if (
      location.pathname === "/signIn" ||
      location.pathname === "/registerLandlordAcc" ||
      location.pathname === "/registerTenantAcc" ||
      location.pathname === "/logIn" ||
      location.pathname.startsWith("/resetPassword") ||
      location.pathname === "/forgotPassword" ||
      location.pathname === "/verifyEmail" ||
      location.pathname.startsWith("/fullAgreement")
    ) {
      setShowFooter(false);
    } else {
      setShowFooter(true);
    }
  }, [location]);

  return <div>{showFooter && children}</div>;
};
export default ShowFooter;
