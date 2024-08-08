import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FillBookmark } from "../../components/imgcomponents/ImgComponents";
import { getUserIdx } from "../../utils/auth";
import '../../assets/style/myPage/Bookmark.css';
import NaverImageSearch from "../../components/NaverImageSearch";
import PageHeader from "../../components/layout/PageHeader";

function BookMark() {
    const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);

    useEffect(() => {
        const fetchBookmarkedRestaurants = async () => {
            const userIdx = getUserIdx();
            if (userIdx) {
                try {
                    console.log("사용자 북마크 정보 요청:", userIdx);
                    const response = await axios.get(`http://localhost:8080/api/bookmarks/restaurants/${userIdx}`);
                    console.log("사용자 북마크 정보 응답:", response.data);
                    setBookmarkedRestaurants(response.data); // 카카오 맵 API 호출 없이 데이터베이스에서 가져온 정보 사용
                } catch (error) {
                    console.error('북마크된 식당 정보 가져오기 실패:', error);
                    // 에러 처리 로직 추가 (필요에 따라)
                }
            }
        };

        fetchBookmarkedRestaurants();
    }, []);

    const handleRestaurantClick = (restaurant) => {
        // 식당 이름 또는 사진 클릭 시 해당 식당의 URL로 이동
        window.open(`https://place.map.kakao.com/${restaurant.restaurantId}`, '_blank')
    };

    const handleBookmarkDelete = async (restaurantId) => {
        const userIdx = getUserIdx();
        if (userIdx) {
            try {
                const deleteResponse = await axios.delete(`http://localhost:8080/api/bookmarks/restaurants/${restaurantId}`, {
                    data: { userIdx }
                });

                if (deleteResponse.status === 204) { // 삭제 성공 시
                    setBookmarkedRestaurants(prevBookmarks => prevBookmarks.filter(bookmark => bookmark.restaurantId !== restaurantId));
                } else {
                    console.error('북마크 삭제 실패:', deleteResponse);
                    // 에러 처리 로직 추가 (필요에 따라)
                }
            } catch (error) {
                console.error('북마크 처리 실패:', error);
            }
        }
    };

    const handleImageLoaded = (imageUrl) => {
        // 이미지 로드 완료 시 호출되는 콜백 함수
        if (imageUrl) {
            // 이미지가 성공적으로 로드된 경우
            console.log("이미지 로드 성공:", imageUrl);
            // 필요에 따라 추가적인 작업 수행 (예: 이미지 캐싱)
        } else {
            // 이미지를 찾지 못했거나 에러 발생 시
            console.warn("이미지 로드 실패 또는 이미지 없음");
            // 필요에 따라 기본 이미지 설정 또는 에러 처리
        }
    };

    return (
        <div className="bookmark-container">
            <PageHeader title="북마크 음식점" />
            <ul className="restaurant-list">
                {bookmarkedRestaurants.map(restaurant => (
                    <li key={restaurant.bookmarkIdx} className="bookmark-restaurant-item">
                        <div className="bookmark-restaurant-content" onClick={() => handleRestaurantClick(restaurant)}>
                            <div className="restaurant-image-wrapper">
                                {/* NaverImageSearch 컴포넌트 사용 */}
                                <NaverImageSearch
                                    restaurantName={restaurant.restaurantName}
                                    onImageLoaded={handleImageLoaded}
                                />
                            </div>
                            <div className="bookmark-restaurant-details">
                                <h3 className="restaurant-name">{restaurant.restaurantName}</h3> {/* restaurantName 사용 */}
                                <p className="restaurant-address">{restaurant.addressName}</p> {/* addressName 사용 */}
                                <p className="restaurant-phone">{restaurant.phone}</p> {/* phone 사용 */}
                            </div>
                        </div>
                        <div className="bookmark-icon" onClick={() => handleBookmarkDelete(restaurant.restaurantId)}>
                            <FillBookmark/>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BookMark;
