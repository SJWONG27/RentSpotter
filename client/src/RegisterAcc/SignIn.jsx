import React from "react";
import { Link } from "react-router-dom";

import '../RegisterAcc/signin.css'
const SignIn = () => {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return(
        <>
        <div id="signincontainer">
            <img src="Images/authe_logo.png" alt="Logo" width='140' height='140'/>
            <h1 className="signinsubTitle text-left fs-2 fw-bolder mt-2">Register Account</h1>
            <h6 className="subTitleDesc">Choose Your Account Type</h6>
            <div class="row row-cols-1 row-cols-md-2 g-5">
                    <div class="col">
                        <div class="card h-100">
                            <img src="Images/landlord.png" class="landlord" alt="landlord" width="200" height="180"/>
                            <h5 class = "cardtitle text-center">Landlord Account</h5>
                            <div className="contextDetails">
                                <p className="signinContext">Simplify Your Property Management With Our Easy-To-Use Landlord Portal. Register Now To Start Streamlining Your Rentals, Tracking, Applicants, And Connecting With Tenants Effortlessly. Join Us And Make Property Management A Breeze!</p>  
                            </div> 
                            <Link className="nav-link" to="/registerLandlordAcc"><button className="buttonLandlord" type="button" onClick={scrollToTop}>Register</button></Link>
                                
                            <br />
                        </div>
                    </div>
                    <div class="col">
                        <div class="card h-100">
                        <img src="Images/tenant.png" class="tenant" alt="landlord" width="200" height="180"/>
                            <h5 class = "cardtitle text-center">Tenant Account</h5>
                            <div className="contextDetails">
                                <p className="signinContext">Get Ready To Find Your Perfect Rental With Ease. Register Your Tenant Account To Search Listings, Communicate With Landlords, And Manage Your Lease Docuemnts All In One Place. Quick, Simple, And Secure - Your Home Journey Starts Here!</p>
                            </div>
                            <Link className="nav-link" to="/registerTenantAcc"><button className="buttonTenant" type="button" onClick={scrollToTop}>Register</button></Link>
                            <br />
                        </div>
                    </div>
                </div>
        </div>
        </>
    );
}

export default SignIn;