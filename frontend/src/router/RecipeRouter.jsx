// src/router/RecipeRouter.jsx
import React from 'react';
import { Routes, Route } from "react-router-dom";
import { RecipeProvider } from '../pages/recipe/RecipeContext';  // 레시피 관련 전역 상태를 관리하는 컨텍스트
import RecipeDetail from '../pages/recipe/RecipeDetail';  // 개별 레시피 상세 페이지 컴포넌트
import RecipeForm from '../pages/recipe/RecipeForm';  // 레시피 생성 폼 컴포넌트
import RecipeModify from '../pages/recipe/RecipeModify';  // 레시피 수정 폼 컴포넌트
import AIRecommendation from '../pages/recipe/AIRecommendation';  // AI 추천 레시피 컴포넌트
import RecipeMain from '../pages/recipe/RecipeMain';  // 레시피 메인 페이지 컴포넌트
import RecipeSearchResults from "../pages/recipe/RecipeSearchResults";  // 레시피 검색 결과 페이지 컴포넌트

/**
 * RecipeRouter 컴포넌트
 * - 레시피 관련 페이지에 대한 라우팅을 관리하는 컴포넌트.
 * - RecipeProvider로 감싸져 있어 하위 컴포넌트에서 전역 레시피 상태에 접근할 수 있음.
 * - 각 라우트는 레시피 관련 페이지(상세보기, 생성, 수정 등)로 연결됨.
 *
 * Routes 내부에 여러 개의 Route가 정의되어 있으며, 각 경로는 특정 컴포넌트를 렌더링함.
 */
function RecipeRouter() {
    return (
        <RecipeProvider> {/* RecipeProvider로 감싸 레시피 관련 상태를 모든 하위 컴포넌트에 제공 */}
            <Routes>
                {/* 레시피 메인 페이지 */}
                <Route path="/" element={<RecipeMain />} />  {/* 기본 경로는 레시피 메인 컴포넌트를 렌더링 */}

                {/* 레시피 검색 결과 페이지 */}
                <Route path="/search" element={<RecipeSearchResults />} />  {/* /search 경로에서 레시피 검색 결과 컴포넌트를 렌더링 */}

                {/* 개별 레시피 상세 페이지 */}
                <Route path="/:recipeIdx" element={<RecipeDetail />} /> {/* /:recipeIdx 경로에서 개별 레시피의 상세 페이지를 렌더링 */}

                {/* 레시피 생성 페이지 */}
                <Route path="/create" element={<RecipeForm />} /> {/* /create 경로에서 레시피 생성 폼을 렌더링 */}

                {/* 레시피 수정 페이지 */}
                <Route path="/modify/:recipeIdx" element={<RecipeForm />} /> {/* /modify/:recipeIdx 경로에서 레시피 수정 폼을 렌더링 */}

                {/* AI 추천 레시피 페이지 */}
                <Route path="/ai-recommendation" element={<AIRecommendation />} /> {/* /ai-recommendation 경로에서 AI 추천 레시피 컴포넌트를 렌더링 */}
            </Routes>
        </RecipeProvider>
    );
}

export default RecipeRouter;