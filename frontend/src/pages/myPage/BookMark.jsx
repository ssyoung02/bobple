import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FillBookmark } from "../../components/imgcomponents/ImgComponents";
import { getUserIdx } from "../../utils/auth";
import '../../assets/style/myPage/Bookmark.css'; // 스타일 파일 추가 (필요에 따라)

function BookMark() {
    const navigate = useNavigate();
    const [bookmarkedRestaurants, setBookmarkedRestaurants] = useState([]);
    const dummyImage = "https://t1.daumcdn.net/thumb/C84x76/?fname=http://t1.daumcdn.net/cfile/2170353A51B82DE005";

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

    return (
        <div className="bookmark-container">
            <h2>북마크 음식점</h2>
            <ul className="restaurant-list">
                {bookmarkedRestaurants.map(restaurant => (
                    <li key={restaurant.bookmarkIdx} className="restaurant-item">
                        <div className="restaurant-content" onClick={() => handleRestaurantClick(restaurant)}>
                            <img src={dummyImage} alt={restaurant.restaurantName} className="restaurant-image" />
                            <div className="restaurant-details">
                                <h3 className="restaurant-name">{restaurant.restaurantName}</h3> {/* restaurantName 사용 */}
                                <p className="restaurant-address">{restaurant.addressName}</p> {/* addressName 사용 */}
                                <p className="restaurant-phone">{restaurant.phone}</p> {/* phone 사용 */}
                            </div>
                        </div>
                        <div className="bookmark-icon" onClick={() => handleBookmarkDelete(restaurant.restaurantId)}>
                            <FillBookmark />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BookMark;
