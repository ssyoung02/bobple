// src/components/Recipe/RecipeList.jsx
import React, { useContext, useEffect } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import RecipeCard from './RecipeCard';
import '../../assets/style/recipe/RecipeList.css'; // CSS 파일 import

function RecipeList() {
    const { recipes, loading, error, searchRecipes, getRecipeById, totalPages, page, changePage } = useContext(RecipeContext);

    useEffect(() => {
        searchRecipes('', '', page, 10); // 초기 레시피 목록 로드 (검색어, 카테고리 빈 값으로 전달)
    }, [searchRecipes, page]); // 페이지 번호가 변경될 때마다 다시 로드

    const handleRecipeClick = (recipeId) => {
        getRecipeById(recipeId); // 레시피 상세 정보 가져오기
        window.scrollTo(0, 0); // 스크롤 맨 위로 이동
    };

    return (
        <div className="recipe-list-container">
            {loading ? (
                <div className="loading-message">Loading...</div> // 로딩 중일 때 메시지 표시
            ) : error ? (
                <div className="error-message">Error: {error.message}</div> // 에러 발생 시 메시지 표시
            ) : recipes.length === 0 ? (
                <div className="no-recipes-message">조회된 레시피가 없습니다.</div> // 레시피가 없을 때 메시지 표시
            ) : (
                <>
                    <div className="recipe-grid">
                        {recipes.map(recipe => (
                            <div key={recipe.recipeIdx} onClick={() => handleRecipeClick(recipe.recipeIdx)} className="recipe-card-wrapper">
                                <RecipeCard recipe={recipe} />
                            </div>
                        ))}
                    </div>

                    {/* 페이지네이션 추가 */}
                    <div className="pagination">
                        <button onClick={() => changePage(page - 1)} disabled={page === 0}>이전</button>
                        <span>{page + 1} / {totalPages}</span>
                        <button onClick={() => changePage(page + 1)} disabled={page === totalPages - 1}>다음</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default RecipeList;
