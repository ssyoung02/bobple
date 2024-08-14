import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserIdx } from "../../utils/auth";
import {Link, useNavigate} from 'react-router-dom';

// Star 컴포넌트 직접 구현
function Star({ filled }) {
    const starIcon = filled ? '★' : '☆';
    return <span className="star">{starIcon}</span>;
}

function MyReviews() {
    const [myReviews, setMyReviews] = useState([]);
    const userIdx = getUserIdx();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyReviews = async () => {
            const token = localStorage.getItem("token");

            if (token && userIdx) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/reviews/user/${userIdx}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`

                        }
                    });
                    setMyReviews(response.data);
                } catch (error) {
                    console.error('Error fetching my reviews:', error);
                    // 에러 처리 (예: 로그인 페이지로 이동)
                    navigate("/myPage/login");
                }
            } else {
                navigate(""); // 로그인되지 않은 경우 처리
            }
        };

        fetchMyReviews();
    }, [userIdx, navigate]); // userIdx가 변경될 때마다 다시 실행

    const handleDelete = async (reviewIdx) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(`http://localhost:8080/api/reviews/${reviewIdx}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 204) {
                    // 삭제된 리뷰를 제외하고 reviews 상태 업데이트
                    setMyReviews(prevReviews => prevReviews.filter(review => review.reviewIdx !== reviewIdx));
                } else {
                    console.error("리뷰 삭제 실패:", response);
                }
            } catch (error) {
                console.error("리뷰 삭제 중 오류 발생:", error);
            }
        }
    };

    return (
        <div>
            <h2>내가 작성한 리뷰</h2>
            <ul style={{listStyle: 'none', padding: 0}}>
                {myReviews.map(review => (
                    <li key={review.reviewIdx}>
                        <h4>{review.restaurantName}</h4> {/* 음식점 이름 추가 */}
                        <div className="star-rating">
                            {[...Array(review.score)].map((_, index) => (
                                <Star key={index} filled/>
                            ))}
                            {[...Array(5 - review.score)].map((_, index) => (
                                <Star key={index + review.score}/>
                            ))}
                        </div>
                        <p>{review.createdAt}</p>
                        {review.photoUrl && (
                            <img
                                src={review.photoUrl}
                                alt="리뷰 사진"
                                style={{width: '300px', height: '300px', objectFit: 'cover'}}
                            />
                        )}
                        <p>{review.review}</p>
                        {/* 모든 리뷰에 수정/삭제 버튼 표시 */}
                        <div>
                            <Link
                                to={`/recommend/restaurant/${review.restaurantId}/review`} // 수정 페이지 경로
                                state={{
                                    restaurantId: review.restaurantId,
                                    review: review,
                                    isEditing: true
                                }} // 수정 데이터 전달
                            >
                                수정
                            </Link>
                            <button onClick={() => handleDelete(review.reviewIdx)}>삭제</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyReviews;
