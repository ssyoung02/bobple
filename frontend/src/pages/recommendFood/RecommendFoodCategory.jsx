/*global kakao*/
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../../assets/style/RecommendFoodCategory.css';

function RecommendFoodCategory() {
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get('category');
    const [restaurants, setRestaurants] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        const ps = new kakao.maps.services.Places();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    searchRestaurantsByCategory(latitude, longitude, category);
                },
                (err) => {
                    console.error("geolocation을 사용할 수 없어요:", err.message);
                }
            );
        } else {
            console.error("geolocation을 사용할 수 없어요.");
        }

        function searchRestaurantsByCategory(latitude, longitude, category, page = 1) {
            const searchOptions = {
                location: new kakao.maps.LatLng(latitude, longitude),
                radius: 1000, // 검색 반경 (미터 단위, 예: 1km) - 필요에 따라 조절 가능
                page: page
            };

            console.log("검색 카테고리:", category); // 검색 카테고리 출력

            // categorySearch 대신 keywordSearch 사용
            ps.keywordSearch(category, (data, status, pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    // 카테고리 이름을 포함하는 음식점만 필터링
                    const filteredData = data.filter(restaurant => restaurant.category_name.includes(category));
                    console.log("검색 결과:", filteredData); // 검색 결과 출력
                    setRestaurants(filteredData);
                    setPagination(pagination);
                } else {
                    console.error("음식점 검색 실패:", status);
                }
            }, searchOptions);
        }
    }, [category, currentPage]);


    // 페이지 이동 함수
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const dummyImage = "https://t1.daumcdn.net/thumb/C84x76/?fname=http://t1.daumcdn.net/cfile/2170353A51B82DE005";

    return (
        <div className="recommend-category-container">
            {/* 검색창 */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="검색 키워드를 입력해주세요"
                    className="search-input"
                />
            </div>

            <h2 className="category-title">{category} BEST</h2>

            <ul className="restaurant-list top-list">
                {restaurants.slice(0, 3).map((restaurant) => (
                    <li key={restaurant.id} className="restaurant-item top-item">
                        <img src={dummyImage} alt={restaurant.place_name} className="restaurant-image"/>
                        <div className="restaurant-info">
                            <h3 className="restaurant-name">{restaurant.place_name}</h3>
                            <div className="restaurant-details">
                                <span className="restaurant-distance">{Math.round(restaurant.distance)}m</span>
                                <span className="restaurant-bookmarks">북마크 {restaurant.bookmarks_count}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <h2 className="nearby-title">주변 음식점</h2>

            <ul className="restaurant-list">
                {restaurants.map((restaurant) => (
                    <li key={restaurant.id} className="restaurant-item">
                        <img src={dummyImage} alt={restaurant.place_name} className="restaurant-image nearby-image"/>
                        <div className="restaurant-info-container"> {/* flex 컨테이너 추가 */}
                            <div className="restaurant-info">
                                <h3 className="restaurant-name">{restaurant.place_name}</h3>
                                <p className="restaurant-address">{restaurant.address_name}</p>
                            </div>
                            <div className="restaurant-details">
                                <span className="restaurant-distance">{Math.round(restaurant.distance)}m</span>
                                <span className="restaurant-category">{restaurant.category_name}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* 페이지네이션 버튼 */}
            <div className="pagination">
                {pagination && (
                    <>
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>이전
                        </button>
                        <span>{currentPage} / {pagination.last}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.last}>다음
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default RecommendFoodCategory;
