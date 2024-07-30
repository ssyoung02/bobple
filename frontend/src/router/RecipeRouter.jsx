import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RecipeProvider } from '../pages/recipe/RecipeContext'; // RecipeContext import 경로 수정
import RecipeList from '../pages/recipe/RecipeList';
import RecipeDetail from '../pages/recipe/RecipeDetail';
import RecipeForm from '../pages/recipe/RecipeForm';
import RecipeModify from '../pages/recipe/RecipeModify';
import AIRecommendation from '../pages/recipe/AIRecommendation';

function RecipeRouter() {
    return (
        <RecipeProvider>
            <Routes>
                <Route path="/" element={<RecipeList />} />
                <Route path="/:recipeIdx" element={<RecipeDetail />} /> {/* 동적 라우팅 */}
                <Route path="/create" element={<RecipeForm />} />
                <Route path="/modify/:recipeIdx" element={<RecipeModify />} /> {/* 동적 라우팅 */}
                <Route path="/ai-recommendation" element={<AIRecommendation />} />
            </Routes>
        </RecipeProvider>
    );
}

export default RecipeRouter;
