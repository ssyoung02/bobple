/*global kakao*/
import React, { useEffect, useState } from 'react';
import '../../assets/style/recommendFood/RecommendMain.css';
import '../../assets/style/allSearch/AllSearch.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import {MainFoodBanner, SearchIcon, Trophy} from "../../components/imgcomponents/ImgComponents";
import {FoodCategories, RecommendedCategories, TeamDinnerPick, TopSearch} from "../../components/SliderComponent";
import { fetchTopKeywords, handleKeyDown, handleSearchClick } from '../../components/Search/SearchAll';


function RecommendMain() {
    const [topKeywords, setTopKeywords] = useState([]);

    useEffect(() => {
        fetchTopKeywords(setTopKeywords);
    }, []);

    const moveFoodWorldCup = () => {
        navigate('/recommend/foodWorldCup/foodWorldCup');
    }

    const [nearbyPub, setNearbyPub] = useState([]);

    const categories = ['전체', '한식', '중식', '일식', '양식', '패스트푸드', '분식', '치킨', '피자', '아시아음식', '뷔페', '도시락'];
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    const handleGroupDinnerPickClick = (category) => {
        const searchCategory = category === '이자카야' ? '일본식주점' : category;
        setSelectedCategory(searchCategory);
        //navigate(`/recommend/recommendFoodCategory?category=${searchCategory}`); // 카테고리 정보 전달
    };


    const filteredProducts = selectedCategory === '전체'
        ? nearbyPub
        : nearbyPub.filter(nearbyPub => nearbyPub.category_name === selectedCategory);

    const handleSearch = () => {
        const trimmedKeyword = keyword.trim();
        if (!trimmedKeyword) {
            alert('키워드를 입력해주세요!');
            return;
        }

        // 검색 키워드를 쿼리 파라미터로 추가하여 RecommendFoodCategory 페이지로 이동
        navigate(`/recommend/recommendFoodCategory?keyword=${trimmedKeyword}`); // 검색어 정보 전달
    };

    useEffect(() => {
        const ps = new kakao.maps.services.Places();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const
                        { latitude, longitude } = position.coords;
                    searchNearbyPub(latitude, longitude);
                },
                (err) => {
                    console.error("geolocation을 사용할 수 없어요:", err.message);
                }
            );
        } else {
            console.error("geolocation을 사용할 수 없어요.");
        }

        function searchNearbyPub(latitude, longitude) {
            const searchOptions = {
                location: new kakao.maps.LatLng(latitude, longitude),
                radius: 1000, // 검색 반경 (미터 단위)
                size: 3,
            };

            ps.keywordSearch('술집', (data, status) => {
                if (status === kakao.maps.services.Status.OK && data.length > 0) {
                    setNearbyPub(data.slice(0, 3)); // 상위 3개 술집 저장 (배열 형태)
                } else {
                    console.error("술집 검색 실패:", status);
                }
            }, searchOptions);
        }
    }, []);

    const dummyImage = "https://t1.daumcdn.net/thumb/C84x76/?fname=http://t1.daumcdn.net/cfile/2170353A51B82DE005";

    return (
        <div className={"recommend-main"}>
            <div className={"recommend-search"}>
                <h3>메뉴가 고민되시나요?</h3>
                {/*검색영역*/}
                <div className="SearchInput">
                    <input
                        className="AllSaerchBox"
                        type="text"
                        placeholder="검색 키워드를 입력해주세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <button className="AllSearchButton" onClick={handleSearch}>
                        <SearchIcon/>
                    </button>
                    {/*실시간 인기*/}
                    <TopSearch/>
                </div>
            </div>

            {/* 메뉴 추천 */}
            <div className="menu-recommendation">
                <h4>이건 어떠신가요?</h4>
                <div className={"menu-recommendation-back"}></div>
                <button className="recommend-button">
                    <div className={"menu-recommendation-img"}>
                        <MainFoodBanner/>
                    </div>
                    <p className={"menu-recommendation-title"}>마라탕</p>
                </button>
            </div>

            {/* 월드컵 */}
            <div className="menu-worldcup">
                <h5>메뉴 정하기 힘들 때</h5>
                <button className="worldcup" onClick={moveFoodWorldCup}>
                    <h4>음식 월드컵</h4>
                    <Trophy/>
                </button>
            </div>

            {/* 추천 카테고리 */}
            <div className="recommended-categories">
                <h5>추천 카테고리</h5>
                <RecommendedCategories/>
            </div>


            {/* 카테고리 */}
            <div className={"food-categories"}>
                <h4>카테고리별 맛집 추천</h4>
                <FoodCategories/>
            </div>

            {/* 회식장소 Pick */}
            <div className="group-dinner-pick">
                <h4>회식장소 Pick</h4>
                <div className="restaurant-category-btn-container">
                    <div className="restaurant-category-buttons">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => handleGroupDinnerPickClick(category)}
                                className={selectedCategory === category ? 'active' : ''}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="restaurant-category-container">
                    {/* 주변 술집 정보 표시 (조건부 렌더링 추가) */}
                    {nearbyPub.length > 0 ? ( // nearbyPubs 배열이 비어있지 않을 때만 렌더링
                        <ul className="restaurant-info-list">
                            {nearbyPub.map((pub) => (
                                <li key={pub.id} className="restaurant-info-item">
                                    <a href={pub.place_url} target="_blank" rel="noreferrer">
                                        <img src={dummyImage} alt={pub.place_name} className="pub-image"/> {/* 이미지 추가 */}
                                    </a>
                                    <div className="pub-info-container">
                                        <a href={pub.place_url} target="_blank" rel="noreferrer">
                                            <div className="pub-name">{pub.place_name}</div>
                                        </a>
                                        <div className="pub-details">
                                            <span className="pub-distance">{Math.round(pub.distance)}m</span>
                                            <span className="pub-bookmarks">북마크 {pub.bookmarks_count || 0}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>주변 술집이 없습니다.</p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default RecommendMain;