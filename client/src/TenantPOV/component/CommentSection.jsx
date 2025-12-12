import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import { format } from "date-fns";
import '../viewproperty.css';
import CommentBox from "./CommentBox";
import AverageRating from "./AverageRating";

const CommentSection = ({ landlordId }) => {
    const [overallRating, setOverallRating] = useState(null);
    const [commentList, setCommentList] = useState([]);
    const [userNameList, setUserNameList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLandlordOverallRating = async () => {
            try {
                const landlordResponse = await axios.get(`/api/applications/landlord/${landlordId}`);
                if (landlordResponse.data.overallRating) {
                    setOverallRating(landlordResponse.data.overallRating);
                    console.log('Overall rating: ', overallRating)
                    try {
                        const commentResponse = await axios.get(`/api/applications/landlordReview/${landlordId}`);
                        setCommentList(commentResponse.data);
                    } catch (error) {
                        console.error('Error fetching comment data:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Failed to load comment data!',
                            confirmButtonColor: "#FF8C22"
                        });
                    }
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching landlord data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to load landlord data!',
                    confirmButtonColor: "#FF8C22"
                });
            }
        };
        fetchLandlordOverallRating();
    }, [landlordId]);

    useEffect(() => {
        async function fetchUsername() {
            try {
                const promises = commentList.map(async (comment) => {
                    const response = await axios.get(`/api/applications/landlord/${comment.tenantId}`);
                    return { username: response.data.username };
                });
                const usernameData = await Promise.all(promises);
                setUserNameList(usernameData);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.error("Error fetching tenant data:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to load tenant data!',
                    confirmButtonColor: "#FF8C22",
                    customClass: {
                        confirmButton: 'my-confirm-button-class'
                    }
                });
            }
        }
        if (commentList.length > 0) {
            fetchUsername();
        } else {
            setLoading(false);
        }
    }, [commentList]);

    return (
        <section id="Comment">
            <header className="commentTitle">Comment And Rating</header>

            <section className="comment-avg">
                <div className="tenant-comment-grid">
                    {commentList.length > 0 && <AverageRating numOfReview={commentList.length} avg={overallRating} />}
                </div>
            </section>
            
            <section className="comments">
                <div className="tenant-comment-grid">
                    {loading ? (
                        <p className="commentPromptTitle">Loading...</p>
                    ) : (
                        <>
                            {commentList.length > 0 ? (
                                commentList.map((comment, index) => (
                                    <div className="comment-grid">
                                        <CommentBox
                                            key={index}
                                            username={userNameList[index]?.username || "Anonymous"}
                                            date={format(new Date(comment.commentDate), 'dd MMMM yyyy')}
                                            comment={comment.commentLandlord}
                                            rating={comment.landlordRating}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="tenantCommentPromptTitle">No comments available.</p>
                            )}
                        </>
                    )}
                </div>
            </section>
        </section>
    );
};

export default CommentSection;