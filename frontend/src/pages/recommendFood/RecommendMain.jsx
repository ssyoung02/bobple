/*global kakao*/
import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../../assets/style/recommendFood/RecommendMain.css';
import '../../assets/style/allSearch/AllSearch.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {
    Bookmark,
    FillBookmark,
    LocationDot,
    MainFoodBanner,
    SearchIcon,
    Trophy
} from "../../components/imgcomponents/ImgComponents";
import {FoodCategories, RecommendedCategories, TeamDinnerPick, TopSearch} from "../../components/SliderComponent";
import { fetchTopKeywords, handleKeyDown, handleSearchClick } from '../../components/Search/SearchAll';

function RecommendMain() {
    const [topKeywords, setTopKeywords] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const navigate = useNavigate();
    const [nearbyPub, setNearbyPub] = useState([]);
    const [allNearbyPub, setAllNearbyPub] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [recommendedFood, setRecommendedFood] = useState(null);
    const [recommendThemes, setRecommendThemes] = useState([]);
    const [page, setPage] = useState(1);
    const observer = useRef();
    const categories = ['전체', '한식', '중식', '일식', '양식', '패스트푸드', '분식', '치킨', '피자', '아시아음식', '도시락'];
    useEffect(() => {
        fetchTopKeywords(setTopKeywords);
    }, []);

    const moveFoodWorldCup = () => {
        navigate('/recommend/foodWorldCup/foodWorldCup');
    }

    const handleGroupDinnerPickClick = (category) => {
        const searchCategory = category === '이자카야' ? '일본식주점' : category;
        setSelectedCategory(searchCategory);
    };

    // New function to load more pubs on scroll
    const loadMorePubs = useCallback(() => {
        const nextPagePubs = allNearbyPub.slice(page * 5, (page + 1) * 5);
        if (nextPagePubs.length > 0) {
            setNearbyPub(prevPubs => [...prevPubs, ...nextPagePubs]);
            setPage(prevPage => prevPage + 1);
        }
    }, [allNearbyPub, page]);

    // Infinite scroll observer
    const lastPubElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                loadMorePubs();
            }
        });
        if (node) observer.current.observe(node);
    }, [loadMorePubs]);

    const filteredProducts = selectedCategory === '전체'
        ? nearbyPub
        : nearbyPub.filter(pub => pub.category_name === selectedCategory);

    const handleRecommendedFoodClick = () => {
        if (recommendedFood) {
            navigate(`/recommend/recommendFoodCategory?keyword=${recommendedFood.foodName}`);
        }
    };

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
                    const { latitude, longitude } = position.coords;
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
                radius: 1000,
                size: 15, // Load more pubs initially
            };

            ps.keywordSearch('술집', (data, status) => {
                if (status === kakao.maps.services.Status.OK && data.length > 0) {
                    setAllNearbyPub(data); // Store all results
                    setNearbyPub(data.slice(0, 5)); // Load initial 5 pubs
                } else {
                    console.error("술집 검색 실패:", status);
                }
            }, searchOptions);
        }
    }, []);

    const dummyImage = "https://t1.daumcdn.net/thumb/C84x76/?fname=http://t1.daumcdn.net/cfile/2170353A51B82DE005";

    useEffect(() => {
        // 서버에서 추천 음식 정보 가져오기 (axios 사용)
        axios.get('/api/recommendFood')
            .then(response => {
                setRecommendedFood(response.data); // axios는 자동으로 JSON 변환
            })
            .catch(error => {
                console.error('추천 음식 정보 가져오기 실패:', error);
            });
    }, []);

    useEffect(() => {
        // 서버에서 추천 테마 정보 가져오기
        axios.get('/api/recommendThemes')
            .then(response => {
                setRecommendThemes(response.data);
            })
            .catch(error => {
                console.error('추천 테마 정보 가져오기 실패:', error);
            });
    }, []);

    const handleThemeClick = (themeIdx) => {
        /* themeIdx에 해당하는 음식 목록 가져오기
        axios.get(`/api/recommendFoods/${themeIdx}`)
            .then(response => {
                const foodNames = response.data;
                console.log("선택된 테마 음식 목록:", foodNames);
                const keyword = foodNames.join(' OR '); // 음식 이름들을 OR 연산자로 연결하여 검색어 생성
                navigate(`/recommend/recommendFoodCategory?keyword=${keyword}`);
            })
            .catch(error => {
                console.error('추천 음식 목록 가져오기 실패:', error);
            });

         */
        // 바로 RecommendFoodCategory 페이지로 이동, 필요한 정보는 이미 recommendThemes에 있음
        const selectedTheme = recommendThemes.find(theme => theme.themeIdx === themeIdx);
        if (selectedTheme) {
            const keyword = selectedTheme.foodNames.join(' OR ');
            navigate(`/recommend/recommendFoodCategory?keyword=${keyword}`);
        }
    };

    return (
        <div className={"recommend-main"}>
            <div className={"recommend-search"}>
                <h3>메뉴가 고민되시나요?</h3>
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
                    <button className="AllSearchButton" onClick={handleSearch} aria-label={"검색"}>
                        <SearchIcon/>
                    </button>
                    <TopSearch/>
                </div>
            </div>

            {/* 메뉴 추천 */}
            <div className="menu-recommendation">
                <h4>이건 어떠신가요?</h4>
                {recommendedFood && ( // 추천 음식 정보가 있을 때만 표시
                <>
                    <div className={"menu-recommendation-back"}></div>
                    <button className="recommend-button" onClick={handleRecommendedFoodClick}>
                        <div className={"menu-recommendation-img"}>
                            <img src={recommendedFood.foodImageUrl} alt={recommendedFood.foodName}/>
                        </div>
                        <p className={"menu-recommendation-title"}>
                            {recommendedFood.foodName}
                        </p>
                    </button>
                    </>
                    )}
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
                추천 카테고리
                <div className="category-description">
                    {recommendThemes.map(theme => (
                        <button key={theme.themeIdx} onClick={() => handleThemeClick(theme.themeIdx)}>
                            {theme.themeDescription}
                        </button>
                    ))}
                </div>
            </div>

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
                    {filteredProducts.length > 0 ? (
                        <ul className="restaurant-info-list">
                            {filteredProducts.map((pub, index) => (
                                <li
                                    key={pub.id}
                                    className="restaurant-info-item"
                                    ref={filteredProducts.length === index + 1 ? lastPubElementRef : null}
                                >
                                    <a className={"restaurant-image-link"} href={pub.place_url} target="_blank" rel="noreferrer">
                                        <img src={dummyImage} alt={pub.place_name} className="pub-image"/>
                                    </a>
                                    <div className="pub-info-container">
                                        <a href={pub.place_url} target="_blank" rel="noreferrer">
                                            <h6 className="pub-name">{pub.place_name}</h6>
                                        </a>
                                        <span
                                            className="pub-distance"><LocationDot/>{Math.round(pub.distance)}m</span>
                                        <button
                                            className="pub-bookmarks"><Bookmark/>북마크 {pub.bookmarks_count || 0}</button>
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
