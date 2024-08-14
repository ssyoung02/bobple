import React, { useState, useEffect } from 'react';
import axios from "axios";
import { getUserIdx } from "../../utils/auth";
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/style/recommendFood/RestaurantReview.css';
import StarRating from "../../utils/StarRating";

function RestaurantReview() {
    const location = useLocation();
    const { restaurantId, review, isEditing: initialIsEditing, restaurantName } = location.state || {};

    const [isEditing, setIsEditing] = useState(initialIsEditing || false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewScore, setReviewScore] = useState(0);
    const userIdx = getUserIdx();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl('');
    };

    useEffect(() => {
        if (isEditing && review) {
            setReviewContent(review.review);
            setReviewScore(review.score);
            setEditingReviewId(review.reviewIdx);
            if (review.photoUrl) { // 기존 이미지가 있을 경우
                setPreviewUrl(review.photoUrl); // 기존 이미지 URL을 설정
            }
        } else {
            setReviewContent("");
            setReviewScore(0);
        }
    }, [isEditing, review]);

    const handleCreate = async () => {
        try {
            if (!userIdx) {
                alert("로그인이 필요합니다.");
                return;
            }

            if (reviewContent.trim() === '') {
                alert("리뷰 내용을 입력해주세요.");
                return;
            }

            const formData = new FormData();
            formData.append("userIdx", userIdx);
            formData.append("restaurantId", restaurantId);
            formData.append("score", reviewScore);
            formData.append("review", reviewContent);
            formData.append("restaurantName", restaurantName);

            if (selectedFile) {
                formData.append("photoUrl", selectedFile);
            }

            const token = localStorage.getItem("token");

            const response = await axios.post("http://localhost:8080/api/reviews", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (response.status === 201) {
                setReviewContent("");
                setReviewScore(0);
                setSelectedFile(null);
                setPreviewUrl('');
                navigate(-1);
            } else {
                console.error("리뷰 작성 실패:", response);
            }
        } catch (error) {
            console.error("리뷰 작성 중 오류 발생:", error);
        }
    };

    const handleEdit = async () => {
        try {
            if (reviewContent.trim() === '') {
                alert("리뷰 내용을 입력해주세요.");
                return;
            }

            const formData = new FormData();
            formData.append("restaurantId", restaurantId);
            formData.append("userIdx", userIdx);
            formData.append("score", reviewScore);
            formData.append("review", reviewContent);
            formData.append("restaurantName", restaurantName);

            if (selectedFile) {
                formData.append("photoUrl", selectedFile);
            }

            const token = localStorage.getItem("token");
            const response = await axios.put(`http://localhost:8080/api/reviews/${editingReviewId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (response.status === 200) {
                setIsEditing(false);
                setEditingReviewId(null);
                setSelectedFile(null);
                setPreviewUrl('');
                navigate(-1);
            } else {
                console.error("리뷰 수정 실패:", response);
            }
        } catch (error) {
            console.error("리뷰 수정 중 오류 발생:", error);
        }
    };

    const handleRatingChange = (newRating) => {
        setReviewScore(newRating);
    };

    const handleGoBack = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    return (
        <>
            <h3 className="review-title">{restaurantName}</h3>
            <div className="star-score">
                <StarRating onRatingChange={handleRatingChange} initialRating={reviewScore}/>
                <p>({reviewScore}점)</p>
            </div>
            <div className="review-form-container">
                <div className="review-file-upload">
                    <div className="image-preview-box">
                        {previewUrl ? (
                            <>
                                <img src={previewUrl} alt="이미지 미리보기" className="image-preview"/>
                                <button className="remove-btn" onClick={handleRemoveImage}>x</button>
                            </>
                        ) : (
                            <div className="image-preview-box-content">
                                <h5 className="image-placeholder">이미지를 업로드하세요</h5>
                                <label htmlFor="profileImageInput" className="review-upload-btn">
                                    +
                                </label>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{display: 'none'}}
                            id="profileImageInput"
                        />
                    </div>
                </div>
                <textarea
                    className="review-form-content"
                    value={reviewContent}
                    onChange={e => setReviewContent(e.target.value)}
                    placeholder="✎  리뷰를 작성해주세요."
                />
                <div className="review-form-btns">
                    {isEditing ? (
                        <>
                            <button className="cancel-form-button" onClick={() => setIsEditing(false)}>⬅️ 이전</button>
                            <button className="edit-form-button" onClick={handleEdit}>수정</button>
                        </>
                    ) : (
                        <>
                            <button className="back-form-button" onClick={handleGoBack}>⬅️ 이전</button>
                            <button className="create-form-button" onClick={handleCreate}>등록</button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default RestaurantReview;
