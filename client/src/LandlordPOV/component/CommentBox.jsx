import React from "react";
import "./commentbox.css";
import StarsGroup from "./LandlordStarsGroup";
import profilePic from "./Rental_Icon/commentProfilePic.png"

const CommentBox = ({ username, date, comment, rating }) => {

  return (
    <div className="comment-card">
      <div className="row-one">
        <div className="left-content">
          <img className="user-img" alt="" src={profilePic} />
          <div className="user-info-container">
            <div className="username">{username}</div>
            <div className="date">{date}</div>
          </div>
        </div>
        <div className="comment-star">
          <StarsGroup rating={rating}/>
        </div>
      </div>

      <div className="row-2">{comment}</div>
    </div>
  );
};

export default CommentBox;