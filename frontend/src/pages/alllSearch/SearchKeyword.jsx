/*global kakao*/
import React, { useState, useEffect } from 'react';
import '../../assets/style/allSearch/AllSearch.css';
import NaverImageSearch from "../../components/NaverImageSearch";
import {Bookmark,  FillBookmark, CaretRight, LocationDot, SearchIcon} from "../../components/imgcomponents/ImgComponents";
import { useParams, useNavigate } from 'react-router-dom';
import { getUserIdx } from "../../utils/auth";
import axios from "axios";

const SearchKeyword = () => {
    const { keyword: initialKeyword } = useParams();  // URL에서 초기 키워드 가져오기
    const [keyword, setKeyword] = useState(initialKeyword); // 검색창 입력 값 관리
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [userBookmarks, setUserBookmarks] = useState([]);

    // 주변 음식점 정렬 (거리순)
    const sortedRestaurants = restaurants.slice().sort((a, b) => a.distance - b.distance);

    useEffect(() => {
        const fetchUserBookmarks = async () => {
            const userIdx = getUserIdx();
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
    }, []);

    const handleBookmarkToggle = async (restaurant) => { // restaurant 객체를 매개변수로 받습니다.
        const userIdx = getUserIdx();
        if (userIdx) { // 로그인한 경우에만 북마크 정보 가져오기
            try {
                const isBookmarked = userBookmarks.includes(restaurant.id);
                if (isBookmarked) {
                    const deleteResponse = await axios.delete(`http://localhost:8080/api/bookmarks/restaurants/${restaurant.id}`, {
                        data: { userIdx }
                    });

                    if (deleteResponse.status === 204) { // 삭제 성공 시
                        setUserBookmarks(prevBookmarks => prevBookmarks.filter(id => id !== restaurant.id));
                        // 북마크 개수 업데이트 (필요에 따라)
                        setRestaurants(prevRestaurants => prevRestaurants.map(r => // r로 변수명 변경
                            r.id === restaurant.id ? { ...r, bookmarks_count: (r.bookmarks_count || 0) - 1 } : r
                        ));
                    } else {
                        console.error('북마크 삭제 실패:', deleteResponse);
                        // 에러 처리 로직 추가 (필요에 따라)
                    }
                } else {
                    // 북마크 추가 요청
                    const addResponse = await axios.post('http://localhost:8080/api/bookmarks/restaurants', {
                        userIdx,
                        restaurantId: restaurant.id,
                        restaurantName: restaurant.place_name,
                        addressName: restaurant.address_name,
                        phone: restaurant.phone
                    });

                    if (addResponse.status === 200) { // 추가 성공 시
                        setUserBookmarks(prevBookmarks => [...prevBookmarks, restaurant.id]);
                        // 북마크 개수 업데이트 (필요에 따라)
                        setRestaurants(prevRestaurants => prevRestaurants.map(r =>  // r로 변수명 변경
                            r.id === restaurant.id ? { ...r, bookmarks_count: (r.bookmarks_count || 0) + 1 } : r
                        ));
                    } else {
                        console.error('북마크 추가 실패:', addResponse);
                        // 에러 처리 로직 추가 (필요에 따라)
                    }
                }
            } catch (error) {
                console.error('북마크 처리 실패:', error);
            }
        }
    };

    useEffect(() => {
        const ps = new kakao.maps.services.Places();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const
                        { latitude, longitude } = position.coords;
                    searchRestaurantsByKeyword(latitude, longitude, keyword);
                },
                (err) => {
                    console.error("geolocation을 사용할 수 없어요:", err.message);
                }
            );
        } else {
            console.error("geolocation을 사용할 수 없어요.");
        }

        function searchRestaurantsByKeyword(latitude, longitude, keyword) {
            const searchOptions = {
                location: new kakao.maps.LatLng(latitude, longitude),
                radius: 2000,
            };

            ps.keywordSearch(keyword, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    const filteredData = data.filter(restaurant => restaurant.category_name.includes("음식점"));
                    setRestaurants(filteredData);
                } else {
                    console.error("음식점 검색 실패:", status);
                }
            }, searchOptions);
        }
    }, [keyword]);


    const handleMoreClick = () => {
        navigate(`/recommend/RecommendFoodCategory?keyword=${encodeURIComponent(keyword)}`); // 키워드 전달
    };

    const handleImageLoaded = (imageUrl) => {
        if (imageUrl) {
            // 이미지가 성공적으로 로드된 경우
        } else {
            console.warn("이미지 로드 실패 또는 이미지 없음");
        }
    };

    const handleSearchClick = () => {
        if (keyword.trim() !== '') {
            navigate(`/search/SearchKeyword/${encodeURIComponent(keyword)}`); // AllSearchRouter 참고
            setKeyword('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className="SearchBox">
            <div className="SearchInput">
                <input
                    className="AllSaerchBox"
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="검색 키워드를 입력해주세요"
                />

                {/* handleSearchClick 함수 자체를 전달 */}
                <button className="AllSearchButton" onClick={handleSearchClick}>
                    <SearchIcon/>
                </button>
            </div>
            <h5>{keyword} 검색 결과</h5>
            <div className="search-result-title">
                <h4>주변 음식점</h4>
                {/* 더보기 버튼 */}
                {restaurants.length > 3 && (
                    <button className="more-button" onClick={handleMoreClick}>더보기</button>
                )}
            </div>
            <ul className="restaurant-list">
                {sortedRestaurants.slice(0, 3).map((restaurant) => (
                    <li key={restaurant.id} className="restaurant-item">
                        <a href={restaurant.place_url} target="_blank" rel="noreferrer">
                            <div className="restaurant-image-wrapper">
                                <NaverImageSearch
                                    restaurantName={restaurant.place_name}
                                    onImageLoaded={handleImageLoaded}
                                />
                            </div>
                        </a>
                        <div className="restaurant-info">
                            <div className="restaurant-left">
                                <a href={restaurant.place_url} target="_blank" rel="noreferrer">
                                    <h6 className="restaurant-name">{restaurant.place_name}</h6>
                                    <p className="restaurant-address">{restaurant.address_name}</p>
                                    <span className="restaurant-category"><CaretRight />{restaurant.category_name.replace('음식점 > ', '')}</span>
                                </a>
                            </div>
                            {/* 북마크 버튼 추가 */}
                            <div className="restaurant-right search-keyword">
                                <span className="restaurant-distance"><LocationDot />{Math.round(restaurant.distance)}m</span>
                                <button
                                    className="restaurant-bookmarks search-keyword"
                                    onClick={() => handleBookmarkToggle(restaurant)}
                                >
                                    {userBookmarks.includes(restaurant.id) ? (
                                        <FillBookmark />
                                    ) : (
                                        <Bookmark />
                                    )}
                                    {restaurant.bookmarks_count || 0}
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchKeyword;
