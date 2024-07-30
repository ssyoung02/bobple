// src/context/RecipeContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const RecipeContext = createContext({
    recipes: [],
    selectedRecipe: null,
    loading: true,
    error: null,
    searchRecipes: () => {},
    getRecipeById: () => {},
    recommendRecipes: () => {},
    createRecipe: () => {},
    updateRecipe: () => {},
    deleteRecipe: () => {},
    likeRecipe: () => {},
    totalElements: 0, // 전체 레시피 개수
    totalPages: 0,    // 전체 페이지 수
    page: 0,         // 현재 페이지 번호
    size: 10,        // 페이지당 레시피 개수
    changePage: () => {}, // 페이지 변경 함수
    createComment: () => {},
    updateComment: () => {},
    deleteComment: () => {}
});


export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    useEffect(() => {
        searchRecipes('', '', page, size); // 초기 레시피 목록 로드 (검색어, 카테고리 빈 값으로 전달)
    }, []);

    const searchRecipes = async (keyword = '', category = '', page = 0, size = 10) => {
        try {
            const response = await axios.get('/api/recipes/search', {
                params: { keyword, category, page, size }
            });
            setRecipes(response.data.content);
            setTotalElements(response.data.totalElements || 0); // totalElements가 없는 경우 0으로 초기화
            setTotalPages(response.data.totalPages || 0); // totalPages가 없는 경우 0으로 초기화
            setPage(response.data.number);
            setSize(response.data.size);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const getRecipeById = async (id) => {
        try {
            const response = await axios.get(`/recipes/${id}`);
            setSelectedRecipe(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const recommendRecipes = async (ingredients) => {
        try {
            const response = await axios.post('/recipes/recommend', { ingredients });
            setRecipes(response.data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    };

    const createRecipe = async (recipeData) => {
        try {
            const response = await axios.post('/recipes', recipeData);
            setRecipes([response.data, ...recipes]);
        } catch (error) {
            setError(error);
        }
    };

    const updateRecipe = async (id, recipeData) => {
        try {
            const response = await axios.put(`/recipes/${id}`, recipeData);
            setRecipes(recipes.map(recipe => (recipe.recipeIdx === id ? response.data : recipe))); // recipeIdx 사용
            setSelectedRecipe(response.data);
        } catch (error) {
            setError(error);
        }
    };

    const deleteRecipe = async (id) => {
        try {
            await axios.delete(`/recipes/${id}`);
            setRecipes(recipes.filter(recipe => recipe.recipeIdx !== id)); // recipeIdx 사용
            setSelectedRecipe(null); // 상세 페이지를 닫거나 다른 페이지로 이동
        } catch (error) {
            setError(error);
        }
    };

    const likeRecipe = async (recipeId) => {
        try {
            const response = await axios.post(`/recipes/${recipeId}/likes`);
            setRecipes(recipes.map(recipe => (recipe.recipeIdx === recipeId ? response.data : recipe))); // recipeIdx 사용
            setSelectedRecipe(prevRecipe => prevRecipe && prevRecipe.recipeIdx === recipeId ? response.data : prevRecipe); // 상세 페이지에서 좋아요 처리 후 업데이트
        } catch (error) {
            setError(error);
        }
    };

    const changePage = (newPage) => {
        setPage(newPage);
        searchRecipes('', '', newPage, size); // 페이지 변경 시 레시피 목록 다시 불러오기
    };


    const createComment = async (recipeId, content) => {
        try {
            const response = await axios.post(`/recipes/${recipeId}/comments`, { recipeContent: content });

            // 댓글 작성 후, 레시피 상세 정보 다시 불러오기
            getRecipeById(recipeId);
        } catch (error) {
            setError(error.message || '댓글 작성 실패');
        }
    };

    const updateComment = async (commentId, updatedContent) => {
        try {
            const response = await axios.patch(`/recipes/comments/${commentId}`, { recipeContent: updatedContent });

            // 댓글 수정 후, 레시피 상세 정보 다시 불러오기
            if (selectedRecipe && selectedRecipe.recipeIdx === commentId) {
                getRecipeById(selectedRecipe.recipeIdx);
            }
        } catch (error) {
            setError(error.message || '댓글 수정 실패');
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await axios.delete(`/recipes/comments/${commentId}`);

            // 댓글 삭제 후, 레시피 상세 정보 다시 불러오기
            if (selectedRecipe && selectedRecipe.recipeIdx === commentId) {
                getRecipeById(selectedRecipe.recipeIdx);
            }
        } catch (error) {
            setError(error.message || '댓글 삭제 실패');
        }
    };

    return (
        <RecipeContext.Provider value={{
            recipes, selectedRecipe, loading, error,
            searchRecipes, getRecipeById, recommendRecipes,
            createRecipe, updateRecipe, deleteRecipe, likeRecipe,
            totalElements, totalPages, page, size, changePage,
            createComment, updateComment, deleteComment }}>
            {children}
        </RecipeContext.Provider>
    );
};

export default RecipeContext;
