import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecipeContext from '../../pages/recipe/RecipeContext';
import LatestRecipeCard from './LatestRecipeCard';
import axios from "../../utils/axios";
import "../../assets/style/recipe/RecipeMain.css";
import {ArrowRightLong, NextTo, PrevTo, SearchIcon} from "../../components/imgcomponents/ImgComponents";
import {UserRecommendedRecipes} from "../../components/SliderComponent";

function RecipeMain() {
    const {
         getRecipeById, totalPages, page, changePage,
        setError, latestRecipes, setCategoryRecipes, setLatestRecipes,userRecommendedRecipes
        // 필요한 값 가져오기
    } = useContext(RecipeContext);
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate(); // useNavigate 훅 사용


    const categoryButtons = [
        { name: '한식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-korean-food.jpg', category: '한식' },
        { name: '양식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-japanese-food.jpg', category: '양식' },
        { name: '일식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-western-food.jpg', category: '일식' },
        { name: '중식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-chinese-food.jpg', category: '중식' },
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

    const moveAIRecommendation = () => {
        navigate('/recipe/ai-recommendation');
    }

    return (
        <div className="recipe-main-container">
            {/* 검색 영역 */}
            <div className="recipe-search-area">
                <input
                    type="text"
                    className="recipe-search-input"
                    placeholder="검색 키워드를 입력해주세요"
                    value={searchKeyword}
                    onChange={handleSearchInputChange}
                />
                <button className="recipe-search-button" onClick={handleSearchClick} aria-label="검색">
                    <SearchIcon/>
                </button>
            </div>

            <button className="AIRecipe" onClick={moveAIRecommendation} >
                <div className="AIRecipeTitle">
                    <p>지금 냉장고에 있는 재료로 뭐 만들어 먹지?</p>
                    <h3>AI 레시피 추천</h3>
                </div>
                <ArrowRightLong/>
            </button>

            {/* 도시락 레시피 추천 섹션 */}
            <div className="lunchbox-recipes">
                <h4>도시락 레시피 추천</h4>
                <div className="category-buttons"> {/* 카테고리 버튼 섹션 추가 */}
                    {categoryButtons.map(button => (
                        <button key={button.name} onClick={() => handleCategoryClick(button.category)}
                                className="category-button">
                            <img src={button.image} alt={button.name}/>
                            <span>#{button.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 유저 추천 레시피 섹션 */}
            <div className="user-recommended-recipes">
                <div className="user-recommended-recipes-title">
                    <h4>유저 추천 레시피</h4>
                    <Link to="/recipe/search?category=&sort=viewsCount,desc,likesCount,desc" className="more-button">
                        더보기
                        <NextTo/>
                    </Link>
                </div>
                <div className="recipe-slide-banner">
                    <UserRecommendedRecipes/>
                </div>
            </div>

            <div className="latest-recipes">
                <h4>최신 레시피</h4>
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
                {/* 페이지네이션 추가 */}
                <div className="recipe-pagination">
                    <button onClick={() => changePage(page - 1)} disabled={page === 0} aria-label="이전">
                        <PrevTo/>
                    </button>
                    <span>{page + 1} / {totalPages}</span>
                    <button onClick={() => changePage(page + 1)} disabled={page === totalPages - 1} aria-label="다음">
                        <NextTo/>
                    </button>
                </div>

            </div>



            {/* 레시피 작성 버튼 (플로팅 버튼) */}
            <div className="create-recipe-button-box">
                <button className="create-recipe-button" onClick={() => navigate('/recipe/create')}>
                    +
                </button>
            </div>
        </div>
    );
}

export default RecipeMain;