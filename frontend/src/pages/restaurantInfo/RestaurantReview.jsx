import React, { useState, useEffect } from 'react';
import axios from "axios";
import {getUserIdx} from "../../utils/auth";
import { useNavigate,useLocation } from 'react-router-dom';

function RestaurantReview() {
    const location = useLocation();
    const { restaurantId, review, isEditing: initialIsEditing } = location.state || {};

    const [isEditing, setIsEditing] = useState(initialIsEditing || false); // isEditing 상태 초기화
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewScore, setReviewScore] = useState(0);
    const userIdx = getUserIdx();
    const navigate = useNavigate();


    useEffect(() => {
        // 수정 모드일 때 기존 리뷰 내용으로 폼 초기화
        if (isEditing && review) {
            setReviewContent(review.review);
            setReviewScore(review.score);
            setEditingReviewId(review.reviewIdx); // 수정할 리뷰의 ID 설정
        } else {
            // 작성 모드일 때 폼 초기화
            setReviewContent("");
            setReviewScore(0);
        }
    }, [isEditing, review]);

    const handleCreate = async () => {
        // 리뷰 작성
        try {
            if (!userIdx) {
                alert("로그인이 필요합니다.");
                return;
            }

            const response = await axios.post("http://localhost:8080/api/reviews", {
                userIdx: userIdx,
                restaurantId: restaurantId,
                score: reviewScore,
                review: reviewContent,
            });

            if (response.status === 201) {
                // 폼 초기화
                setReviewContent("");
                setReviewScore(0);
                navigate(-1); // 이전 페이지로 이동
            } else {
                console.error("리뷰 작성 실패:", response);
            }
        } catch (error) {
            console.error("리뷰 작성 중 오류 발생:", error);
        }
    };

    const handleEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/reviews/${editingReviewId}`, {
                score: reviewScore,
                review: reviewContent
            });

            if (response.status === 200) {
                setIsEditing(false);
                setEditingReviewId(null);

                // RestaurantInfo에서 리뷰 목록을 다시 가져오도록 state 업데이트
                navigate(-1);
            } else {
                console.error("리뷰 수정 실패:", response);
            }
        } catch (error) {
            console.error("리뷰 수정 중 오류 발생:", error);
        }
    };

    return (
        <div>
            {/* 리뷰 작성/수정 폼 */}
            <textarea
                value={reviewContent}
                onChange={e => setReviewContent(e.target.value)}
                placeholder="리뷰를 작성해주세요."
            />
            <div>
                <select value={reviewScore} onChange={(e) => setReviewScore(parseInt(e.target.value, 10))}> {/* 10진수로 변환 */}
                    <option value={0}>별점 선택</option>
                    <option value={1}>★☆☆☆☆ (1점)</option>
                    <option value={2}>★★☆☆☆ (2점)</option>
                    <option value={3}>★★★☆☆ (3점)</option>
                    <option value={4}>★★★★☆ (4점)</option>
                    <option value={5}>★★★★★ (5점)</option>
                </select>
            </div>
            {isEditing ? (
                <>
                    <button onClick={handleEdit}>수정 완료</button>
                    <button onClick={() => setIsEditing(false)}>취소</button>
                </>
            ) : (
                <button onClick={handleCreate}>리뷰 등록</button>
            )}

        </div>
    );
}

export default RestaurantReview;
