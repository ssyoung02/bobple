/*global kakao*/
import React, { useEffect, useState } from 'react';
import '../../assets/style/RecommendMain.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function RecommendMain() {
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const navigate = useNavigate();
    const [nearbyPub, setNearbyPub] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [recommendedFood, setRecommendedFood] = useState(null);
    const [recommendThemes, setRecommendThemes] = useState([]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        navigate(`/recommend/recommendFoodCategory?category=${category}`); // 카테고리 정보 전달
    };

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

    const handleGroupDinnerPickClick = (category) => {
        const searchCategory = category === '이자카야' ? '일본식주점' : category; // 이자카야 특별 처리
        navigate(`/recommend/recommendFoodCategory?category=${searchCategory}`);
    };

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
        <div className="recommend-container">
            <h3 className="recommend-title">메뉴가 고민되시나요?</h3>

            {/* 검색창 */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="검색 키워드를 입력해주세요"
                    className="search-input"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <button onClick={handleSearch}>검색</button>
            </div>

            {/* 실시간 인기 메뉴 */}
            <div className="popular-menus">
                <h6>실시간 인기 메뉴</h6>
            </div>


            {/* 메뉴 추천 */}
            <div className="menu-recommendation">
                <p>이건 어떠신가요?</p>
                {recommendedFood && ( // 추천 음식 정보가 있을 때만 표시
                    <div className="recommend-food-container" onClick={handleRecommendedFoodClick}>
                        <img src={recommendedFood.foodImageUrl} alt={recommendedFood.foodName}
                             className="recommend-food-image"/>
                        {recommendedFood.foodName}
                    </div>
                )}
            </div>

            {/* 월드컵 */}
            <div className="menu-worldcup">
                <p>메뉴 정하기 힘들 때</p>
                <button className="worldcup">월드컵</button>
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


            {/* 카테고리 */}
            <div className="recommend-title">카테고리별 맛집 추천</div>
            <div>
                {['전체', '한식', '중식', '일식', '양식', '패스트푸드', '분식', '치킨', '피자', '아시아음식', '도시락'].map((category) => (
                    <button
                        key={category}
                        className={`recommend-category-button ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => handleGroupDinnerPickClick(category)} // Link 대신 onClick 사용
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* 회식장소 Pick */}
            <div className="group-dinner-pick">
                회식장소 Pick
                <div className="text-buttons">
                    {/* 버튼 클릭 시 handleGroupDinnerPickClick 함수 호출 */}
                    {['고기', '회', '호프', '이자카야'].map((category) => (
                        <button key={category} onClick={() => handleGroupDinnerPickClick(category)}>
                            {category}
                        </button>
                    ))}
                </div>
            </div>

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
    );
}

export default RecommendMain;
