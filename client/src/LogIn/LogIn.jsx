import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from "react-router-dom";
import { faEnvelope, faLock, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../LogIn/login.css'
import { login } from "../controllers/authControllers";

const LogIn = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        username: "",
        password: ""
    });

    const handleLogin = async () => {
        const newErrors = {}; // Create a new object to accumulate errors
    
        if (!email.trim()) {
            newErrors.email = "*email is required";
          } else if (!/\S+@\S+\.\S+/.test(email)) {
            // "\S+ means one or more character"
            newErrors.email = "*email is invalid";
          }
        if (!password.trim()) {
            newErrors.password = "*password is required"; // Add error for password
        }
        setErrors(newErrors); // Update the state with the new error object
    
        if (Object.keys(newErrors).length === 0) {
            console.log("Form is valid, proceed with login");
            try {
                // const response = await axios.post('/api/auth/logIn', { email, password });
                const response = await login(email, password);
                console.log("Login response:", response);
                localStorage.setItem('token', response.token);
                console.log("Token stored:", response.token);
                localStorage.setItem('username', response.user.username);
                console.log("Username stored:", response.user.username);

                const userRole = response.user.role; 
                if (userRole === 'tenant') {
                    navigate('/tenantHome');
                } else if (userRole === 'landlord') {
                    navigate('/landlordHome');
                }
                
            } catch (error) {
                Swal.fire({
                    // "Login Failed", 
                    // error.response.data.message, "error"
                    title: "Login Failed",
                    text: error.response.data.message,
                    icon: "error",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#FF8C22",
                    customClass: {
                        title: 'my-title-class_login',
                        confirmButton: 'my-confirm-button-class'
                    } 
                });    //need to cahnge button color??
                setErrors({ form: "Login Failed: " + error.response.data.message });
            }
        }
    };
    
    return(

        <div id="login" className="d-flex">

            <img src="/Images/authe_logo.png" alt="Logo" width='140' height='140'/>

            <div className="content-section">
                <div className="left-section">
                    <h2 className="logIn_wlcTxt">Welcome Back To <br/>RentSpotter !</h2>
                    <p className="brief_txt">Direct Dialogue: Your Bridge-Free<br/> Connection to Home</p>
                    <img src="/Images/signIn_pic.svg" alt="signIn_pic" width='950' height='auto' style={{marginLeft:'-14em', marginTop:'-9em'}}/>
                </div>

                <div className="right-section">
                    <div className="login-form">
                        <h2 className="loginTitle fs-2 fw-bolder mt-4">Log In</h2>

                        <div className="form align-items-center mb-4">
                            <FontAwesomeIcon icon={faEnvelope} className="fa-lg me-3 fa-fw"size="2x"/>
                            <input type="text" id="username" className="form-control" placeholder="Email" required onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="errorMessage"> {errors.email && <span>{errors.email}</span>} </div>
                        

                        <div className="form align-items-center mb-4">
                            <FontAwesomeIcon icon={faLock} className="fa-lg me-3 fa-fw"size="2x"/>
                            <input value={password} type={visible ? "text" : "password"} id="password" className="form-control" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required/>
                                <div className="login-eye-icon" onClick={() => setVisible(!visible)}>
                                    {visible ? <FontAwesomeIcon icon={faEye} className="fa-lg fa-fw"/> : <FontAwesomeIcon icon={faEyeSlash} className="fa-lg fa-fw"/>}
                                </div>
                        </div>
                        <div className="errorMessage"> {errors.password && <span>{errors.password}</span>} </div>

                <Link to="/forgotPassword" className="forgot-password-link">Forgot password?</Link>
                <button id="loginbutton" type="button" onClick={handleLogin}>Log In</button>
                <p className="account-option">
                    Don't have an account ? <Link to="/signIn" className="sign-up-link">SIGN UP</Link>
                </p>
                </div>
            </div>
        </div>
  </div>
);
}

export default LogIn;