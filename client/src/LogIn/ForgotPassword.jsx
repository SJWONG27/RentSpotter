import React, { useState } from "react";
import Swal from 'sweetalert2'
import axios from 'axios';
import '../LogIn/forgotpassword.css'
const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    axios.defaults.withCredentials = true;

    const handleResetPasswordButton = async (e) => {
        console.log("Click Reset Password Button");
        e.preventDefault();
        const validationErrors = {};

        if (!email.trim()) {
            validationErrors.email = "*Please enter your email"
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = "*email is invalid"
        }
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {

            try {
                await axios.post('api/auth/forgotPassword', { email });
                Swal.fire({
                    title: "Check Your Email",
                    text: "We have sent an email to " + email + " to reset your password. Link in email will expire within 5 minutes.",
                    imageUrl: "Images/checkEmail.gif",
                    imageHeight: 200,
                    imageAlt: "email",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#FF8C22",
                    customClass: {
                        title: 'my-title-class-login',
                        confirmButton: 'my-confirm-button-class',
                        text: 'my-loginText-class'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        setEmail(""); // Clear the email input after successful operation
                    }
                });
            } catch (error) {
                console.error(error);
                console.error("Reset Password Error:", error.response?.data);
                Swal.fire({
                    title: "Error!",
                    text: error.response?.data?.message || "An unknown error occurred",
                    icon: "error",
                    confirmButtonColor: "#FF8C22",
                    customClass: {
                        title: 'my-title-class',
                        confirmButton: 'my-confirm-button-class'
                    }
                });
            }
        }
    }

    return (
        <div id="forgotPassword">
            <img src="Images/authe_logo.png" alt="Logo" width='140' height='140' />
            <div className="container text-center">
                <img src="Images/lock.png" alt="Logo" width='150' height='150' />
                <h2 className="forgotPasswordTitle fs-2 fw-bolder mt-4">Forgot Password</h2>
                <p className="forgotPasswordDescTitle">Enter the email address associated with your account.</p>
                <div className="form d-flex flex-row align-items-center mb-4">
                    <div className="form-outline flex-fill mb-0">
                        <input type="email" id="email" className="form-control" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="errorMessageResetPassword"> {errors.email && <span>{errors.email}</span>} </div>
                </div>
                <button id="resetPasswordButton" onClick={handleResetPasswordButton} type="button">Reset Password</button>
            </div>
        </div>
    );
}

export default ForgotPassword;