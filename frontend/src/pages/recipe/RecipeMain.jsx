// src/components/Recipe/RecipeMain.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import RecipeContext from '../../pages/recipe/RecipeContext';
import RecipeCard from './RecipeCard';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faArrowRightLong} from "@fortawesome/free-solid-svg-icons";
import '../../assets/style/recipe/RecipeMain.css';
import axios from "axios";

function RecipeMain() {
    const { recipes, loading, error, searchRecipes, getRecipeById, totalPages, page, changePage, setError } = useContext(RecipeContext);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [categoryRecipes, setCategoryRecipes] = useState([]); // 카테고리별 레시피
    const [latestRecipes, setLatestRecipes] = useState([]); // 최신 레시피
    const navigate = useNavigate();

    useEffect(() => {
        // 초기 레시피 목록 로드 (최신순으로 1페이지 10개)
        searchRecipes('', '', 0, 10, 'createdAt,desc');
    }, [searchRecipes]);

    const handleRecipeClick = (recipeId) => {
        getRecipeById(recipeId); // 레시피 상세 정보 가져오기
        window.scrollTo(0, 0); // 스크롤 맨 위로 이동
    };

    const handleSearchInputChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const handleSearchClick = () => {
        searchRecipes(searchKeyword, '', 0, 10, 'createdAt,desc');
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

    // 컴포넌트 마운트 시 도시락 레시피와 최신 레시피 가져오기
    useEffect(() => {
        getRecipesByCategory('도시락');
        getLatestRecipes();
    }, []);

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
                <div className="recipe-grid">
                    {categoryRecipes.length > 0 ? (
                        categoryRecipes.map(recipe => (
                            <div key={recipe.recipeIdx} onClick={() => handleRecipeClick(recipe.recipeIdx)} className="recipe-card-wrapper">
                                <RecipeCard recipe={recipe} />
                            </div>
                        ))
                    ) : (
                        <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
                    )}
                </div>
                <Link to="/recipe/search?category=도시락">
                    <button className="more-button">더보기</button>
                </Link>
            </div>

            {/* 유저 추천 레시피 섹션 */}
            <div className="user-recommended-recipes">
                <h3>유저 추천 레시피</h3>
                <div className="recipe-grid">
                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <div key={recipe.recipeIdx} onClick={() => handleRecipeClick(recipe.recipeIdx)} className="recipe-card-wrapper">
                                <RecipeCard recipe={recipe} />
                            </div>
                        ))
                    ) : (
                        <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
                    )}
                </div>
                <Link to="/recipe/search">
                    <button className="more-button">더보기</button>
                </Link>
            </div>

            {/* 최신 레시피 섹션 */}
            <div className="latest-recipes">
                <h3>최신 레시피</h3>
                <div className="recipe-grid">
                    {latestRecipes.length > 0 ? (
                        latestRecipes.map(recipe => (
                            <div key={recipe.recipeIdx} onClick={() => handleRecipeClick(recipe.recipeIdx)} className="recipe-card-wrapper">
                                <RecipeCard recipe={recipe} />
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
