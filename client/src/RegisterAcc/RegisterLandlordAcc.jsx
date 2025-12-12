import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import {
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from 'axios';
import "../RegisterAcc/registeracc.css";
import {register} from "../controllers/authControllers";

const RegisterLandlordAcc = ({role}) => {

    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email:'',
        phonenumber:'',
        password:''
    })
    formData.role = role;
    const [errors, setErrors] = useState({})
    const formRef = useRef(null);
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData, [name] : value
        })
    }
    const handleRegisterClick = async (e) =>{
        e.preventDefault();
        const validationErrors = {};
    
        // First, perform the validation
        if(!formData.username.trim()){
            validationErrors.username = "*username is required"
        }
        if(!formData.email.trim()){
            validationErrors.email = "*email is required"
        }else if(!/\S+@\S+\.\S+/.test(formData.email)){
            validationErrors.email = "*email is invalid"
        }
        if(!formData.phonenumber.trim()){
            validationErrors.phonenumber = "*phone number is required"
        }else if(!/^\d{10,11}$/.test(formData.phonenumber)){
            validationErrors.phonenumber = "*phone number is invalid"
        }
        if(!formData.password.trim()){
            validationErrors.password = "*password is required"
        }else if(formData.password.length < 6){
            validationErrors.password = "*password should be at least 6 characters"
        }
    
        setErrors(validationErrors);
    
        console.log("Form Data:", formData);
        console.log("Validation Errors:", validationErrors);
    
        // Then, check for the absence of validation errors
        if (Object.keys(validationErrors).length === 0) {
            console.log("No validation errors, attempting to show alert.");
            
            try {
                // const response = await axios.post('/api/auth/registerLandlordAcc', formData);
                const response = await register(formData);
                // Handle successful registration
                console.log(response.data); // Log response from the server
                
                // No validation errors, show success message
                // Show the SweetAlert
                Swal.fire({
                    title: "Account Registered",
                    titleColor: "#FF5C00",
                    text: "Hooyah" + formData.email + "",
                    imageUrl: "Images/checkEmail.gif",
                    imageHeight:200,
                    imageAlt: "email",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#FF8C22",
                    customClass: {
                        title: 'my-title-class',
                        confirmButton: 'my-confirm-button-class'
                    }
                }).then(() => {
                    navigate('/logIn');
                    // Clear the form fields
                    formRef.current.reset();
                    // Clear the form data
                    setFormData({
                        username: '',
                        email: '',
                        phonenumber: '',
                        password: ''
                    });
                });
            } catch (error) {
                console.log("Validation errors exist, not showing alert.");
                // Handle registration error
                console.error(error); // Log error message
                console.error("Registration Error:", error.response.data);
                // Handle showing the error message from the backend
                Swal.fire({
                    title: "Error!",
                    text: error.response?.data?.message || "An unknown error occurred",
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#FF8C22",
                    customClass: {
                        title: 'my-title-class',
                        confirmButton: 'my-confirm-button-class'
                    } 
                });
            }
            
        }
    }
    
    return(
        <div id="register">
            <img src="Images/authe_logo.png" alt="Logo" width='140' height='140'/>
            <div className="container text-center">
            <div className="row">
                <div className="col">
                    <h2 className="registerTitleLandlord fs-2 fw-bolder mt-4">Register As Landlord</h2>
                    <img src="Images/landlord.png" class="landlord" alt="landlord" width="350" />
                </div>
                <div className="col rightCol">
                <form id="register-form" ref={formRef} onSubmit={handleRegisterClick} method="post">
                    <div className="form d-flex flex-row align-items-center mb-4" >
                        <FontAwesomeIcon icon={faUser} className="fa-lg me-3 fa-fw" size="2x"/>
                        <div class="form-outline flex-fill mb-0">
                            <input 
                                type="text" 
                                name="username" 
                                id="username" 
                                class="form-control" 
                                placeholder="Username" 
                                autoComplete="off" 
                                onChange={handleChange}/>
                        </div>
                        <div className="displayErrorMessage">
                            {errors.username && <span>{errors.username}</span>}
                        </div>
                    </div>


                    <div className="form d-flex flex-row align-items-center mb-4" >
                        <FontAwesomeIcon icon={faEnvelope} className="fa-lg me-3 fa-fw"size="2x"/>
                        <div className="form-outline flex-fill mb-0" >
                        <input 
                            type="email" 
                            name="email" 
                            id="register_email" 
                            class="form-control" 
                            placeholder="Email" 
                            autoComplete="on"
                            onChange={handleChange}/>
                        </div>
                        <div className="displayErrorMessage">
                            {errors.email && <span>{errors.email}</span>}
                        </div>
                    </div>

                    <div className="form d-flex flex-row align-items-center mb-4" >
                        <FontAwesomeIcon icon={faPhone} className="fa-lg me-3 fa-fw"size="2x"/>
                        <div className="form-outline flex-fill mb-0" >
                        <input 
                            type="tel" 
                            name="phonenumber" 
                            id="phonenumber" 
                            class="form-control" 
                            placeholder="Phone Number ( Eg: 0113456789 )" 
                            autoComplete="off"
                            onChange={handleChange}/>
                        </div>
                        <div className="displayErrorMessage">
                            {errors.phonenumber && <span>{errors.phonenumber}</span>}
                        </div>
                    </div>
                    <div className="form d-flex flex-row position-relative align-items-center mb-4">
                        <FontAwesomeIcon icon={faLock} className="fa-lg me-3 fa-fw"size="2x"/>
                        <div className="form-outline flex-fill mb-0 position-relative">
                            <input 
                                value={formData.password} 
                                type={visible ? "text" : "password"} 
                                name="password" 
                                id="password" 
                                class="form-control" 
                                placeholder="Password" 
                                onChange={handleChange} 
                                />  
                        </div>
                        <div className="displayErrorMessage">
                            {errors.password && <span>{errors.password}</span>}
                        </div>
                        <div className="eye-icon" onClick={() => setVisible(!visible)}>{ visible ? <FontAwesomeIcon icon={faEye} className="fa-lg me-3 fa-fw"/> : <FontAwesomeIcon icon={faEyeSlash} className="fa-lg me-3 fa-fw"/> }</div>
                    </div>

                    <div id="bottomDetails">
                        <button id="registerButtonLandlord" type="submit">Register</button>
                        <div id="haveAcc">Already have an account ? <Link className="link" to="/logIn">LOG IN</Link></div>
                    </div>
                </form>
            </div>
            </div>
        </div>
        </div>
    );
}

export default RegisterLandlordAcc;