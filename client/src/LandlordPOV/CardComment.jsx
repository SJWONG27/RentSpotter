import React from "react";
import "./cardComment.css";

const CardComment = ({ userImgSrc, username, date, comment }) => {
  return (
    <div id="applicantCommentCard">
      <div className="row-one">
        <div className="left-content">
          <img className="user-img" alt="" src={userImgSrc} />
          <div className="user-info-container">
            <div className="username">{username}</div>
            <div className="date">{date}</div>
          </div>
        </div>
        <div className="comment-star">
          <img
            className="star"
            loading="lazy"
            alt=""
            src="/Images/commentStar.png"
          />
        </div>
      </div>
      <div className="row-2">{comment}</div>
    </div>
  );
};

export default CardComment;
