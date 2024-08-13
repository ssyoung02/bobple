import React, {useEffect, useState} from 'react';
import {Link, useLocation, useParams, useNavigate} from 'react-router-dom';
import {Bookmark, FillBookmark, CaretRight, LocationDot} from "../../components/imgcomponents/ImgComponents";
import {getUserIdx} from "../../utils/auth";
import axios from "axios";
import NaverImageSearch from "../../components/NaverImageSearch";

// Star 컴포넌트 직접 구현
function Star({ filled }) {
    const starIcon = filled ? '★' : '☆';
    return <span className="star">{starIcon}</span>;
}


function RestaurantInfo() {
    const location = useLocation();
    const { restaurant: initialRestaurant } = location.state || {};
    const { restaurantId } = useParams();

    const [userBookmarks, setUserBookmarks] = useState([]);
    const [restaurant, setRestaurant] = useState(initialRestaurant);
    const [reviews, setReviews] = useState([]);
    const userIdx = getUserIdx();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDataAndReviews = async () => {
            const token = localStorage.getItem("token");
            const userIdx = getUserIdx();

            if (token && userIdx) {
                try {
                    // 1. 사용자 데이터 가져오기
                    const userResponse = await axios.get(`http://localhost:8080/api/users/${userIdx}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setUser(userResponse.data); // 사용자 정보 상태 업데이트

                    // 2. 리뷰 데이터 가져오기
                    const reviewResponse = await axios.get(`http://localhost:8080/api/reviews/${restaurantId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    setReviews(reviewResponse.data);
                } catch (error) {
                    console.error('Error fetching user or review data:', error);
                    navigate("/myPage/login");
                }
            } else {
                navigate("");
            }
        };

        fetchUserDataAndReviews(); // 함수 이름 변경
    }, [navigate, restaurantId, userIdx]);

    useEffect(() => {
        const fetchUserBookmarks = async () => {
            if (userIdx) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/bookmarks/restaurants/${userIdx}`);
                    setUserBookmarks(response.data.map(bookmark => bookmark.restaurantId));
                } catch (error) {
                    console.error('북마크 정보 가져오기 실패:', error);
                }
            }
        };

        fetchUserBookmarks();
    }, [restaurantId]);


    const handleBookmarkToggle = async () => {
        if (userIdx) {
            try {
                const isBookmarked = userBookmarks.includes(restaurant.id);
                if (isBookmarked) {
                    const deleteResponse = await axios.delete(`http://localhost:8080/api/bookmarks/restaurants/${restaurant.id}`, {
                        data: { userIdx }
                    });

                    if (deleteResponse.status === 204) {
                        setUserBookmarks(prevBookmarks => prevBookmarks.filter(id => id !== restaurant.id));
                        // RestaurantInfo 페이지에서 restaurant 상태를 직접 업데이트 (restaurant 객체 복사 후 수정)
                        setRestaurant(prevRestaurant => ({
                            ...prevRestaurant,
                            bookmarks_count: (prevRestaurant.bookmarks_count || 0) - 1
                        }));
                    } else {
                        console.error('북마크 삭제 실패:', deleteResponse);
                    }
                } else {
                    const addResponse = await axios.post('http://localhost:8080/api/bookmarks/restaurants', {
                        userIdx,
                        restaurantId: restaurant.id,
                        restaurantName: restaurant.place_name,
                        addressName: restaurant.address_name,
                        phone: restaurant.phone
                    });

                    if (addResponse.status === 200) {
                        setUserBookmarks(prevBookmarks => [...prevBookmarks, restaurant.id]);
                        // RestaurantInfo 페이지에서 restaurant 상태를 직접 업데이트 (restaurant 객체 복사 후 수정)
                        setRestaurant(prevRestaurant => ({
                            ...prevRestaurant,
                            bookmarks_count: (prevRestaurant.bookmarks_count || 0) + 1
                        }));
                    } else {
                        console.error('북마크 추가 실패:', addResponse);
                    }
                }
            } catch (error) {
                console.error('북마크 처리 실패:', error);
            }
        }
    };

    const handleImageLoaded = (imageUrl) => {
        if (imageUrl) {
            // 이미지가 성공적으로 로드된 경우
        } else {
            console.warn("이미지 로드 실패 또는 이미지 없음");
        }
    };

    const handleDelete = async (reviewIdx) => {
        if (window.confirm("정말 삭제하시겠습니까?")) { // 확인 창 띄우기
            try {
                const token = localStorage.getItem('token');
                const response = await axios.delete(`http://localhost:8080/api/reviews/${reviewIdx}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Authorization 헤더에 토큰 추가
                    }
                });

                if (response.status === 204) {
                    // 삭제된 리뷰를 제외하고 reviews 상태 업데이트
                    setReviews(prevReviews => prevReviews.filter(review => review.reviewIdx !== reviewIdx));
                } else {
                    console.error("리뷰 삭제 실패:", response);
                }
            } catch (error) {
                console.error("리뷰 삭제 중 오류 발생:", error);
            }
        }
    };

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    const averageScore = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length).toFixed(1) // 소수점 첫째 자리까지 표시
        : 0;

    return (
        <div className="restaurant-info-container">
            <NaverImageSearch restaurantName={restaurant.place_name} onImageLoaded={handleImageLoaded}
                              width="300" height="200"/>
            <h2>{restaurant.place_name}</h2>
            <p>{restaurant.address_name} </p>
            <p>(지번: {restaurant.road_address_name})</p>
            <p><CaretRight/>{restaurant.category_name.replace(/ > /g, ' > ')}</p>
            <p>{restaurant.phone}</p>
            <p><LocationDot/>{Math.round(restaurant.distance)}m</p>
            {/* 홈페이지 링크 추가 */}
            {restaurant.place_url && (
                <p>
                    <a href={restaurant.place_url} target="_blank" rel="noopener noreferrer">홈페이지</a>
                </p>
            )}

            <button className="restaurant-bookmarks"
                    onClick={handleBookmarkToggle}>
                {userBookmarks.includes(restaurant.id) ? <FillBookmark /> : <Bookmark />}
                {restaurant.bookmarks_count || 0}
            </button>

            {/* 리뷰 영역 */}
            <div className="review-section">
                <h3>리뷰</h3>
                <div className="average-score">
                    {/* 평균 별점 표시 */}
                    <span>★ {averageScore}</span>
                </div>
                <Link
                    to={`/recommend/restaurant/${restaurant.id}/review`}
                    state={{restaurantId: restaurant.id, reviews: reviews}}
                >
                    리뷰 작성
                </Link>
                <ul style={{listStyle: 'none', padding: 0}}>
                    {reviews.map(review => (
                        <li key={review.reviewIdx}>
                            <div className="user-info">
                                {review.userProfileImage && ( // 조건부 렌더링 유지
                                    <img
                                        src={review.userProfileImage}
                                        alt="사용자 프로필 이미지"
                                        style={{width: '50px', height: '50px'}} // 이미지 크기 설정 추가
                                    />
                                )}
                                <span>{review.userName}</span>
                            </div>
                            <div className="review-content">
                                <div className="star-rating">
                                    {[...Array(review.score)].map((_, index) => (
                                        <Star key={index} filled/>
                                    ))}
                                    {[...Array(5 - review.score)].map((_, index) => (
                                        <Star key={index + review.score}/>
                                    ))}
                                </div>
                                <span className="review-time">{review.createdAt}</span>
                                {/* 리뷰 사진 추가 */}
                                {review.photoUrl && (
                                    <img
                                        src={review.photoUrl}
                                        alt="리뷰 사진"
                                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <p>{review.review}</p>

                                {/* 사용자가 작성한 리뷰인 경우에만 수정/삭제 버튼 표시 */}
                                {review.userIdx.toString() === userIdx && (
                                    <div>
                                        <Link
                                            to={`/recommend/restaurant/${restaurant.id}/review`} // 수정 페이지 경로
                                            state={{
                                                restaurantId: restaurant.id,
                                                review: review,
                                                isEditing: true,
                                                restaurantName: restaurant.place_name
                                            }} // 수정 데이터 전달
                                        >
                                            수정
                                        </Link>
                                        <button onClick={() => handleDelete(review.reviewIdx)}>삭제</button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
}

export default RestaurantInfo;
