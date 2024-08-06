/*global kakao*/
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../assets/style/recommendFood/RecommendFoodCategory.css';
import {Bookmark, CaretRight, LocationDot, SearchIcon} from "../../components/imgcomponents/ImgComponents";
import {TopSearch} from "../../components/SliderComponent";
import theme from "tailwindcss/defaultTheme";
import axios from "axios";
import useRecommendThemes from "../../hooks/RecommendFoodHooks"


function RecommendFoodCategory() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialThemeName = searchParams.get('themeName');

    const initialCategory = searchParams.get('category');
    const initialKeyword = searchParams.get('keyword');
    const initialTheme = searchParams.get('theme');

    const [category, setCategory] = useState(initialCategory || ''); // 초기값 설정
    const [keyword, setKeyword] = useState(initialKeyword || ''); // 초기값 설정
    const [restaurants, setRestaurants] = useState([]);
    const [displayedKeyword, setDisplayedKeyword] = useState(initialKeyword || ''); // 표시될 검색어 상태 추가
    const navigate = useNavigate();

    // 주변 음식점 정렬 (거리순)
    const sortedRestaurants = restaurants.slice().sort((a, b) => a.distance - b.distance);

    useEffect(() => {
        const ps = new kakao.maps.services.Places();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    // 카테고리가 '전체'인 경우 keywordSearch로 모든 음식점 검색
                    if (category === '전체') {
                        searchAllRestaurants(latitude, longitude);
                    } else if (keyword) {
                        searchRestaurantsByKeyword(latitude, longitude, keyword);
                    } else if (initialTheme) { // theme 쿼리 파라미터 확인
                        searchRestaurantsByTheme(latitude, longitude, initialTheme);
                    } else {
                        searchRestaurantsByCategory(latitude, longitude, category);
                    }
                },
                (err) => {
                    console.error("geolocation을 사용할 수 없어요:", err.message);
                }
            );
        } else {
            console.error("geolocation을 사용할 수 없어요.");
        }

        function searchAllRestaurants(latitude, longitude) { // 모든 음식점 검색 함수 추가
            const searchOptions = {
                location: new kakao.maps.LatLng(latitude, longitude),
                radius: 2000, // 검색 반경 (미터 단위)
            };

            ps.keywordSearch('음식점', (data, status) => { // "음식점" 키워드로 검색
                if (status === kakao.maps.services.Status.OK) {
                    setRestaurants(data);
                } else {
                    console.error("음식점 검색 실패:", status);
                }
            }, searchOptions);
        }

        function searchRestaurantsByCategory(latitude, longitude, category) {
            const searchOptions = {
                location: new kakao.maps.LatLng(latitude, longitude),
                radius: 2000, // 검색 반경 (미터 단위)
            };

            // categorySearch 대신 keywordSearch 사용
            ps.keywordSearch(category, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    // 카테고리 이름을 포함하는 음식점만 필터링
                    const filteredData = data.filter(restaurant => restaurant.category_name.includes(category));
                    setRestaurants(filteredData);

                } else {
                    console.error("음식점 검색 실패:", status);
                }
            }, searchOptions);
        }

        function searchRestaurantsByKeyword(latitude, longitude, keyword) {
            const searchOptions = {
                location: new kakao.maps.LatLng(latitude, longitude),
                radius: 2000, // 검색 반경 (미터 단위)
            };

            ps.keywordSearch(keyword, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    // 음식점 카테고리를 포함하는 데이터만 필터링하여 resolve
                    const filteredData = data.filter(restaurant => restaurant.category_name.includes("음식점"));
                    setRestaurants(filteredData);
                } else {
                    console.error("음식점 검색 실패:", status);
                }
            }, searchOptions);
        }

        function searchRestaurantsByTheme(latitude, longitude, themeKeyword) {
            const searchOptions = {
                location: new kakao.maps.LatLng(latitude, longitude),
                radius: 2000, // 검색 반경 (미터 단위)
            };

            const foodNames = themeKeyword.split(" ");
            let allSearchResults = [];

            const promises = foodNames.map(foodName => {
                return new Promise((resolve, reject) => {
                    ps.keywordSearch(foodName.trim(), (data, status) => {
                        if (status === kakao.maps.services.Status.OK) {
                            // 음식점 카테고리를 포함하는 데이터만 필터링하여 resolve
                            const filteredData = data.filter(restaurant => restaurant.category_name.includes("음식점"));
                            resolve(filteredData);
                        } else {
                            reject(new Error("음식점 검색 실패: " + status));
                        }
                    }, searchOptions);
                });
            });

            Promise.all(promises)
                .then(results => {
                    allSearchResults = results.flat();
                    // 중복 제거 로직 추가
                    const uniqueSearchResults = Array.from(new Set(allSearchResults.map(JSON.stringify))).map(JSON.parse);

                    setRestaurants(uniqueSearchResults);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [category]);


    const handleSearch = () => {
        const trimmedKeyword = keyword.trim();
        if (!trimmedKeyword) {
            alert('키워드를 입력해주세요!');
            return;
        }
        try {
            axios.post('http://localhost:8080/api/search/saveKeyword', trimmedKeyword, {
                headers: {
                    'Content-Type': 'text/plain',
                },
                withCredentials: true,
            });
            console.log('검색어가 저장되었습니다.');
            // fetchTopKeywords(setTopKeywords);  // 인기 검색어 업데이트 (필요 없는 경우 주석 처리)
        } catch (error) {
            console.error('검색어 저장 실패:', error);
            // 에러 처리 로직 추가 (필요에 따라)
        }
        // 검색 키워드를 쿼리 파라미터로 설정하고 페이지 새로고침
        setSearchParams({ keyword: trimmedKeyword });

        window.location.reload();

        // 검색 실행 후 displayedKeyword 업데이트
        setDisplayedKeyword(trimmedKeyword);
    };

    const dummyImage = "https://t1.daumcdn.net/thumb/C84x76/?fname=http://t1.daumcdn.net/cfile/2170353A51B82DE005";

    // displayedCategory 또는 displayedKeyword 또는 initialThemeName을 표시
    const displayedTitle = keyword ? displayedKeyword : (category || initialThemeName);

    const { recommendThemes } = useRecommendThemes();
    const [filteredThemes, setFilteredThemes] = useState([]);

    useEffect(() => {
        const filtered = recommendThemes.filter(theme => theme.themeName === displayedTitle);
        setFilteredThemes(filtered);
    }, [recommendThemes, displayedTitle]);


    return (
        <div className="recommend-category-container">
            {/* 검색창 */}
            <div className="SearchInput">
                <input
                    type="text"
                    placeholder="검색 키워드를 입력해주세요"
                    className="AllSaerchBox"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)} // 입력 값 변경 시 keyword 상태 업데이트
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') { // 엔터 키 입력 시 검색 실행
                            handleSearch();
                        }
                    }}
                />
                <button className="AllSearchButton" onClick={handleSearch} aria-label={"검색"}>
                    <SearchIcon/>
                </button>
            </div>

                {filteredThemes.length > 0 && (
                    filteredThemes.map(theme => (
                        <div key={theme.themeIdx} className="category-banner"> {/* Add key here */}
                            <img src={theme.themeBannerUrl} alt={theme.themeDescription}/>
                        </div>
                    ))
                )}

            <div>
                <h3 className="category-title">
                    {displayedTitle && `${displayedTitle} `}
                    <span>BEST</span>
                </h3>

                <ul className="restaurant-list top-list">
                    {restaurants.slice(0, 3).map((restaurant) => (
                        <li key={restaurant.id} className="top-item">
                            <a href={restaurant.place_url} target="_blank" rel="noreferrer">
                                <img src={dummyImage} alt={restaurant.place_name} className="restaurant-image"/>
                            </a>
                            <div className="top-restaurant-info">
                                <a className={"restaurant-info-link"} href={restaurant.place_url} target="_blank"
                                   rel="noreferrer">
                                    <h6 className="restaurant-name">{restaurant.place_name}</h6>
                                </a>
                                <span
                                    className="restaurant-distance"><LocationDot/>{Math.round(restaurant.distance)}m</span>
                                <button
                                    className="restaurant-bookmarks"><Bookmark/>{restaurant.bookmarks_count}</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h5 className="nearby-title">주변 음식점</h5>
                <ul className="restaurant-list">
                    {sortedRestaurants.map((restaurant) => (
                        <li key={restaurant.id} className="restaurant-item">
                            <a href={restaurant.place_url} target="_blank" rel="noreferrer">
                                <img src={dummyImage} alt={restaurant.place_name}
                                     className="restaurant-list-image"/>
                            </a>
                            <div className="restaurant-info">
                                <div className="restaurant-left">
                                    <a href={restaurant.place_url} target="_blank" rel="noreferrer">
                                        <h6 className="restaurant-name">{restaurant.place_name}</h6>
                                        <p className="restaurant-address">{restaurant.address_name}</p>
                                        <span
                                            className="restaurant-category"><CaretRight/>{restaurant.category_name.replace('음식점 > ', '')}</span>
                                    </a>
                                </div>
                                <div className="restaurant-right">
                                    <span className="restaurant-distance">
                                        <LocationDot/>{Math.round(restaurant.distance)}m
                                    </span>
                                    <button className="restaurant-right-bookmarks">
                                        <div className="bookmark-icon"><Bookmark/></div>
                                        0{restaurant.bookmarks_count}
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
}

export default RecommendFoodCategory;
