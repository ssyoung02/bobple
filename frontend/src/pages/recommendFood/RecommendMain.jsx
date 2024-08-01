/*global kakao*/
import React, {useEffect, useState} from 'react';
import '../../assets/style/recommendFood/RecommendMain.css';
import '../../assets/style/allSearch/AllSearch.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import {MainFoodBanner, SearchIcon, Trophy} from "../../components/imgcomponents/ImgComponents";
import {FoodCategories, RecommendedCategories, TeamDinnerPick, TopSearch} from "../../components/SliderComponent";
import { fetchTopKeywords, handleKeyDown, handleSearchClick } from '../../components/Search/SearchAll';

const dummyRecommendations = [
    {id: 1, place_name: '브레댄코 강남점', category_name: '음식점 > 카페 > 커피전문점', address: '서울특별시 강남구 역삼동 825-19', distance: '500', reviews: '125'},
    {id: 2, place_name: '담미온', category_name: '음식점 > 한식 > 국수' , address: '서울특별시 강남구 역삼동 823', distance: '800', reviews: '256'},
    {id: 3, place_name: '이삭토스트', category_name: '음식점 > 간식 > 토스트', address: '서울특별시 강남구 역삼동 817-11', distance: '1.2km', reviews: '88'},
    {id: 4, place_name: '풍년참숯갈비', category_name: '음식점 > 한식 > 육류,고기 > 갈비', address: '서울 서초구 서초대로74길 29', distance: '600', reviews: '30'},
];

function RecommendMain() {
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState('');
    const [topKeywords, setTopKeywords] = useState([]);

    useEffect(() => {
        fetchTopKeywords(setTopKeywords);
    }, []);

    const moveFoodWorldCup = () => {
        navigate('/recommend/foodWorldCup/foodWorldCup');
    }

    const categories = ['전체', '고기', '한식', '간식', '카페', '파스타'];
    const [selectedCategory, setSelectedCategory] = useState('전체');

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };
    const filteredProducts = selectedCategory === '전체'
        ? dummyRecommendations
        : dummyRecommendations.filter(dummyRecommendations => dummyRecommendations.category_name === selectedCategory);


    return (
        <div className={"recommend-main"}>
            <div className={"recommend-search"}>
                <h3>메뉴가 고민되시나요?</h3>
                {/*검색영역*/}
                <div className="SearchInput">
                    <input
                        className="AllSaerchBox"
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown(keyword, setTopKeywords)}
                        placeholder="검색 키워드를 입력해주세요"
                    />
                    <button className="AllSearchButton" onClick={handleSearchClick(keyword, setTopKeywords)}>
                        <SearchIcon/>
                    </button>
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
                                onClick={() => handleCategoryClick(category)}
                                className={selectedCategory === category ? 'active' : ''}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="restaurant-category-container">
                    <div className="restaurant-list">
                        {filteredProducts.map(restaurant => (
                            <button key={restaurant.id} className="restaurant-item">
                                {/*<img src={restaurant.image} alt={restaurant.name}/>*/}
                                <div className="restaurant-name">{restaurant.name}</div>
                                <div className="restaurant-distance">{restaurant.distance}m</div>
                                <div className="restaurant-reviews">{restaurant.reviews} 리뷰</div>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default RecommendMain