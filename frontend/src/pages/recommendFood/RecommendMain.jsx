import React from 'react';
import '../../assets/style/RecommendMain.css';

function RecommendMain() {
    const dummyRecommendations = [
        {id: 1, name: '브레댄코 강남점', address: '서울특별시 강남구 역삼동 825-19', distance: '500', reviews: '125'},
        {id: 2, name: '담미온', address: '서울특별시 강남구 역삼동 823', distance: '800', reviews: '256'},
        {id: 3, name: '이삭토스트', address: '서울특별시 강남구 역삼동 817-11', distance: '1.2km', reviews: '88'},
    ];

    return (
        <div className="recommend-container">
            <h3 className="recommend-title">메뉴가 고민되시나요?</h3>

            {/* 검색창 */}
            <div className="search-container">
                <input type="text" placeholder="검색 키워드를 입력해주세요" className="search-input"/>

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

            <div className="recommend-title">카테고리별 맛집 추천</div>
            <div>
                {['전체', '한식', '중식', '일식', '양식', '기타'].map((category) => (
                    <button key={category} className="recommend-category-button">
                        {category}
                    </button>
                ))}
            </div>

            {/* 회식장소 Pick */}
            <div className="group-dinner-pick">
                회식장소 Pick
                <div className="text-buttons">
                    <button>고기</button>
                    <button>노래타운</button>
                    <button>회</button>
                    <button>호프</button>
                    <button>이자카야</button>
                </div>
                <ul className="restaurant-info-list">
                    {dummyRecommendations.map((restaurant) => (
                        <li key={restaurant.id} className="restaurant-info-item">
                            <div className="restaurant-name">{restaurant.name}</div>
                            <div className="restaurant-distance">{restaurant.distance}m</div>
                            <div className="restaurant-reviews">{restaurant.reviews} 리뷰</div>

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default RecommendMain;
