// src/router/RecipeRouter.jsx
import React from 'react';
import { Routes, Route } from "react-router-dom";
import { RecipeProvider } from '../pages/recipe/RecipeContext';
import RecipeList from '../pages/recipe/RecipeList';
import RecipeDetail from '../pages/recipe/RecipeDetail';
import RecipeForm from '../pages/recipe/RecipeForm';
import RecipeModify from '../pages/recipe/RecipeModify';
import AIRecommendation from '../pages/recipe/AIRecommendation';
import RecipeMain from '../pages/recipe/RecipeMain';
import SearchFilter from "../pages/recipe/SearchFilter";
import RecipeSearchResults from "../pages/recipe/RecipeSearchResults"; // RecipeMain 추가

function RecipeRouter() {
    return (
        <RecipeProvider>
            <Routes>
                <Route path="/" element={<RecipeMain />} /> {/* RecipeMain 컴포넌트 추가 */}
                <Route path="/search" element={<RecipeSearchResults />} /> {/* 추가 */}
                <Route path="/:recipeIdx" element={<RecipeDetail />} />
                <Route path="/create" element={<RecipeForm />} />
                <Route path="/modify/:recipeIdx" element={<RecipeModify />} />
                <Route path="/ai-recommendation" element={<AIRecommendation />} />
            </Routes>
        </RecipeProvider>
    );
}

export default RecipeRouter;