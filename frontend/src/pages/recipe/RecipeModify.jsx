// src/components/Recipe/RecipeModify.jsx
import React, { useState, useContext, useEffect } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeForm from './RecipeForm';
import '../../assets/style/recipe/RecipeModify.css'; // CSS 파일 import

function RecipeModify() {
    const { recipeIdx } = useParams();
    const { getRecipeById, selectedRecipe, updateRecipe } = useContext(RecipeContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (recipeIdx) {
            getRecipeById(recipeIdx);
        }
    }, [recipeIdx, getRecipeById]);

    const handleSubmit = async (recipeData) => {
        try {
            await updateRecipe(recipeIdx, recipeData);
            alert('레시피가 성공적으로 수정되었습니다.');
            navigate(`/recipe/${recipeIdx}`); // 수정 후 상세 페이지로 이동
        } catch (error) {
            console.error('레시피 수정 실패:', error);
            alert('레시피 수정에 실패했습니다.');
        }
    };

    return (
        <div className="recipe-modify-container">
            {!selectedRecipe ? (
                <div className="loading-message">Loading...</div>
            ) : (
                <RecipeForm initialRecipe={selectedRecipe} onSubmit={handleSubmit} />
            )}
        </div>
    );
}

export default RecipeModify;
