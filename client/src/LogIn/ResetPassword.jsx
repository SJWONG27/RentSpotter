import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import axios from 'axios';
import '../LogIn/forgotpassword.css';

const ResetPassword = () => {
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { id, token } = useParams(); 
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const handleResetButton = async (e) => {
        e.preventDefault();
        const validationErrors = {};
        if (!password.trim()) {
            validationErrors.password = "*password is required";
        } else if (password.length < 6) {
            validationErrors.password = "*password should be at least 6 characters";
        }
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await axios.post(`/api/auth/resetPassword/${id}/${token}`, { password });
                if (response.data) {
                    Swal.fire({
                        text: "Your password has been reset successfully.",
                        icon: "success",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#FF8C22",
                        customClass: {
                            confirmButton: 'my-confirm-button-class-success'
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/logIn'); // Navigate to login page
                        }
                    });
                    setPassword(""); // Clear password after success
                }
            } catch (error) {
                console.error("Reset Password Error:", error);
                Swal.fire({
                    title: "Error!",
                    text: error.response.data.message,
                    icon: "error",
                    confirmButtonColor: "#d33",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#FF8C22",
                    customClass: {
                        title: 'my-title-class',
                        confirmButton: 'my-confirm-button-class'
                    } 
                });
            }
        }
    };

    return (
        <div id="forgotPassword">
            <img src="/Images/authe_logo.png" alt="Logo" width='140' height='140'/>
            <div className="container text-center">
                <img src="/Images/lock.png" alt="Logo" width='150' height='150'/>
                <h2 className="forgotPasswordTitle fs-2 fw-bolder mt-4">Reset Password</h2>
                <p className="forgotPasswordDescTitle">Enter the new password</p>
                <div className="form d-flex flex-row align-items-center mb-4">
                    <div className="form-outline flex-fill mb-0">
                        <input 
                            style={{marginTop:"-3em"}}
                            value={password} 
                            type={visible ? "text" : "password"} 
                            name="password" 
                            id="password" 
                            className="form-control" 
                            placeholder="Password" 
                            onChange={handleChange} 
                        />
                    </div>
                    <div style={{marginRight:'40.5em', marginTop:'29.7em'}} className="eye-icon" onClick={() => setVisible(!visible)}>
                        {visible ? <FontAwesomeIcon icon={faEye} className="fa-lg me-3 fa-fw"/> : <FontAwesomeIcon icon={faEyeSlash} className="fa-lg me-3 fa-fw"/>}
                    </div>
                    <div className="errorMessageResetPassword2"> {errors.password && <span>{errors.password}</span>} </div>
                </div>
                <button id="resetPasswordButton" onClick={handleResetButton} type="button">Reset Password</button>
            </div>
        </div>
    );
};

export default ResetPassword;
