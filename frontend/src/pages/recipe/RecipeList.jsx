// src/components/Recipe/RecipeList.jsx
import React, { useContext, useEffect } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import RecipeCard from './RecipeCard';
import '../recipe/css/RecipeList.css';

function RecipeList() {
    const { recipes, loading, error, searchRecipes, getRecipeById, totalPages, page, changePage } = useContext(RecipeContext);

    useEffect(() => {
        searchRecipes('', '', page, 10);
    }, [searchRecipes, page]);

    const handleRecipeClick = (recipeId) => {
        getRecipeById(recipeId);
        window.scrollTo(0, 0);
    };

    return (
        <div className="recipe-list-container">
            {loading ? (
                <div className="loading-message">Loading...</div> // 로딩 중일 때 메시지 표시
            ) : error ? (
                <div className="error-message">Error: {error.message}</div> // 에러 발생 시 메시지 표시
            ) : (
                <>
                    <div className="recipe-grid">
                        {recipes.length === 0 ? ( // 레시피 목록이 비어있는 경우
                            <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
                        ) : (
                            recipes.map(recipe => (
                                <div key={recipe.recipeIdx} onClick={() => handleRecipeClick(recipe.recipeIdx)} className="recipe-card-wrapper">
                                    <RecipeCard recipe={recipe} />
                                </div>
                            ))
                        )}
                    </div>

                    {/* 페이지네이션 추가 */}
                    {totalPages > 1 && ( // 2개 이상의 페이지가 있을 때만 페이지네이션 표시
                        <div className="pagination">
                            <button onClick={() => changePage(page - 1)} disabled={page === 0}>이전</button>
                            <span>{page + 1} / {totalPages}</span>
                            <button onClick={() => changePage(page + 1)} disabled={page === totalPages - 1}>다음</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default RecipeList;
