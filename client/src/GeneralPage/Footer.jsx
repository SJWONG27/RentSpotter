import React from "react";
import './footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return(
        <div>
            <footer id="footer_backgroundColor">
                <div class="social_links_row">
                    <h2>Follow Us</h2>
                    <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                    <a href="#"><img src="Images/fb.png" style={{ widths: 'auto', height:'25px',marginBottom:'0.25em', marginRight:'1.2em'}} /></a>
                </div>
                <hr></hr>
                <div class="nav-footer">
                    <div class="nav_col1">
                        <ul>
                            <a href="#"><li>About Us</li></a>
                            <a href="#"><li>Contact Us</li></a>
                            <a href="#"><li>Share Feedback</li></a>
                        </ul>
                    </div>
                    <div class="nav_col2">
                        <ul>
                            <a href="#"><li>Our Products</li></a>
                            <a href="#"><li>QnA</li></a>
                        </ul>
                    </div>
                </div>
                <hr></hr>
                <div class="footer_copyright">
                    &copy; 2024 RentSpotter.Com Malaysia Sdn Bhd. All rights Reserved
                </div>
            </footer>
        </div>
    );
}

export default Footer;