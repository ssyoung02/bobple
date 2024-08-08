import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecipeContext from '../../pages/recipe/RecipeContext';
import RecipeCard from './RecipeCard';
import UserRecommendedRecipeCard from './UserRecommendedRecipeCard';
import LatestRecipeCard from './LatestRecipeCard';
import axios from "../../utils/axios";
import "../../assets/style/recipe/RecipeMain.css";

function RecipeMain() {
    const {
        recipes, loading, searchRecipes, getRecipeById, totalPages, page, changePage,
        setRecipes, setError, categoryRecipes, latestRecipes, setCategoryRecipes, setLatestRecipes,userRecommendedRecipes
        // 필요한 값 가져오기
    } = useContext(RecipeContext);
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate(); // useNavigate 훅 사용


    const categoryButtons = [
        { name: '한식', image: '/images/korean.jpg', category: '한식' },
        { name: '양식', image: '/images/western.jpg', category: '양식' },
        { name: '일식', image: '/images/japanese.jpg', category: '일식' },
        { name: '중식', image: '/images/chinese.jpg', category: '중식' },
    ];

    useEffect(() => {
        getRecipesByCategory('');
        getLatestRecipes();
        // // 초기 레시피 목록 로드 (최신순으로 1페이지 10개)
        // searchRecipes('', '', 0, 10, 'createdAt,desc');
    }, []);

    const handleRecipeClick = (recipeId) => {
        getRecipeById(recipeId); // 레시피 상세 정보 가져오기
        window.scrollTo(0, 0); // 스크롤 맨 위로 이동
    };

    const handleSearchInputChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const handleSearchClick = () => {
        navigate(`/recipe/search?keyword=${searchKeyword}&category=&sort=viewsCount,desc`);
    };

    const handleCategoryClick = (category) => {
        navigate(`/recipe/search?category=${category}&sort=viewsCount,desc`);
    };

    const getRecipesByCategory = async (category) => {
        try {
            const response = await axios.get('/api/recipes/search', {
                params: { category, page: 0, size: 4, sort: 'createdAt,desc' }
            });
            setCategoryRecipes(response.data.content);
        } catch (error) {
            setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const getLatestRecipes = async () => {
        try {
            const response = await axios.get('/api/recipes/latest', { // 엔드포인트 수정
                params: { page: 0, size: 4 } // 페이징 정보 전달
            });
            setLatestRecipes(response.data.content);
        } catch (error) {
            setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="recipe-main-container">
            {/* 상단 부분 */}
            <div className="top-section">
                <div className="search-area">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="검색 키워드를 입력해주세요"
                        value={searchKeyword}
                        onChange={handleSearchInputChange}
                    />
                    <button className="search-button" onClick={handleSearchClick}>
                        검색
                    </button>
                </div>
            </div>

            <div className="ai-recommendation">
                <h3>AI 레시피 추천</h3>
                <Link to="/recipe/ai-recommendation">
                    <button className="ai-button">
                        지금 냉장고에 있는 재료로 만들어봐!
                    </button>
                </Link>
            </div>

            {/* 도시락 레시피 추천 섹션 */}
            <div className="lunchbox-recipes">
                <h3>도시락 레시피 추천</h3>
                <div className="category-buttons"> {/* 카테고리 버튼 섹션 추가 */}
                    {categoryButtons.map(button => (
                        <button key={button.name} onClick={() => handleCategoryClick(button.category)}
                                className="category-button">
                            <img src={button.image} alt={button.name}/>
                            <span>{button.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 유저 추천 레시피 섹션 */}
            <div className="user-recommended-recipes">
                <div className="header">
                    <h3>유저 추천 레시피</h3>
                    <Link to="/recipe/search?category=&sort=viewsCount,desc,likesCount,desc" className="more-button">더보기</Link>
                </div>
                <div className="recipe-list">
                    {userRecommendedRecipes.length > 0 ? (
                        userRecommendedRecipes.map(recipe => (
                            <UserRecommendedRecipeCard key={recipe.recipeIdx} recipe={recipe}/>
                        ))
                    ) : (
                        <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
                    )}
                </div>
            </div>

            <div className="latest-recipes">
                <h3>최신 레시피</h3>
                <div className="latest-recipe-list">
                    {latestRecipes.length > 0 ? (
                        latestRecipes.map(recipe => (
                            <div key={recipe.recipeIdx} onClick={() => handleRecipeClick(recipe.recipeIdx)}
                                 className="latest-recipe-card-wrapper">
                                <LatestRecipeCard recipe={recipe}/>
                            </div>
                        ))
                    ) : (
                        <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
                    )}
                </div>
            </div>


            {/* 페이지네이션 추가 */}
            <div className="pagination">
                <button onClick={() => changePage(page - 1)} disabled={page === 0}>이전</button>
                <span>{page + 1} / {totalPages}</span>
                <button onClick={() => changePage(page + 1)} disabled={page === totalPages - 1}>다음</button>
            </div>


            {/* 레시피 작성 버튼 (플로팅 버튼) */}
            <button className="create-recipe-button" onClick={() => navigate('/recipe/create')}>
                +
            </button>
        </div>
    );
}

export default RecipeMain;