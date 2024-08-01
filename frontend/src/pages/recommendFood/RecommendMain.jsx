/*global kakao*/
import React, { useEffect, useState } from 'react';
import '../../assets/style/RecommendMain.css';
import { useNavigate } from 'react-router-dom';

function RecommendMain() {
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const navigate = useNavigate();
    const [nearbyPub, setNearbyPub] = useState([]);
    const [keyword, setKeyword] = useState("");

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        navigate(`/recommend/recommendFoodCategory?category=${category}`); // 카테고리 정보 전달
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
                <button className="recommend-button">마라탕</button>
            </div>

            {/* 월드컵 */}
            <div className="menu-worldcup">
                <p>메뉴 정하기 힘들 때</p>
                <button className="worldcup">월드컵</button>
            </div>

            {/* 추천 카테고리 */}
            <div className="recommended-categories">
                추천 카테고리
                <div className="category-icons">
                    {/* 아이콘 제거 */}
                </div>
                <div className="category-description">
                    <button>칼칼</button>
                    <button>부장님은 느끼한 게 싫다고 하셨어</button>
                </div>
            </div>


            {/* 카테고리 */}
            <div className="recommend-title">카테고리별 맛집 추천</div>
            <div>
                {['전체', '한식', '중식', '일식', '양식', '패스트푸드', '분식', '치킨', '피자', '아시아음식', '뷔페', '도시락'].map((category) => (
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
