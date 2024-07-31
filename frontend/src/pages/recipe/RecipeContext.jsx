import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const RecipeContext = createContext({
    recipes: [],
    selectedRecipe: null,
    loading: true,
    error: null,
    searchRecipes: () => { },
    getRecipeById: () => { },
    recommendRecipes: () => { },
    createRecipe: () => { },
    updateRecipe: () => { },
    deleteRecipe: () => { },
    likeRecipe: () => { },
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
    changePage: () => { },
    createComment: () => { },
    updateComment: () => { },
    deleteComment: () => { },
});
// 선택된 레시피 설정 함수
const setSelectedRecipe = (recipe) => {
    setSelectedRecipe(recipe);
};

export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null); // 비구조화 할당
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const navigate = useNavigate();


    useEffect(() => {
        searchRecipes('', '', page, size);
    }, [page, size]);


    const searchRecipes = async (keyword = '', category = '', page = 0, size = 10, sort = 'createdAt,desc') => {
        try {
            const response = await axios.get('/api/recipes/search', {
                params: { keyword, category, page, size, sort }
            });
            setRecipes(response.data.content);
            setTotalElements(response.data.totalElements || 0);
            setTotalPages(response.data.totalPages || 0);
            setPage(response.data.number);
            setSize(response.data.size);
        } catch (error) {
            setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getRecipeById = async (id) => {
        try {
            const response = await axios.get(`/api/recipes/${id}`);
            setSelectedRecipe(response.data);
        } catch (error) {
            setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const recommendRecipes = async (ingredients) => {
        try {
            const response = await axios.post('/api/recipes/recommend', { ingredients });
            setRecipes(response.data);
        } catch (error) {
            setError(error.message || 'AI 추천 중 오류가 발생했습니다.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const createRecipe = async (recipeData) => {
        try {
            const response = await axios.post('/api/recipes', recipeData);
            setRecipes([response.data, ...recipes]);
            navigate(`/recipe/${response.data.recipeIdx}`); // 등록 후 상세페이지로 이동
        } catch (error) {
            setError(error.message || '레시피 등록에 실패했습니다.');
            console.error(error);
        }
    };

    // 레시피 수정 함수
    const updateRecipe = async (recipeId, recipeData) => {
        try {
            const response = await axios.put(`/api/recipes/${recipeId}`, recipeData);
            setRecipes(recipes.map(recipe => (recipe.recipeIdx === recipeId ? response.data : recipe))); // recipeIdx 사용
            setSelectedRecipe(response.data);
        } catch (error) {
            setError(error.message || '레시피 수정에 실패했습니다.');
            console.error(error);
        }
    };

    const deleteRecipe = async (id) => {
        try {
            await axios.delete(`/api/recipes/${id}`);
            setRecipes(recipes.filter(recipe => recipe.recipeIdx !== id)); // recipeIdx 사용
            setSelectedRecipe(null); // 상세 페이지를 닫거나 다른 페이지로 이동
        } catch (error) {
            setError(error.message || '레시피 삭제에 실패했습니다.');
            console.error(error);
        }
    };

    const likeRecipe = async (recipeId) => {
        try {
            const response = await axios.post(`/api/recipes/${recipeId}/likes`);
            setRecipes(recipes.map(recipe => (recipe.recipeIdx === recipeId ? response.data : recipe))); // recipeIdx 사용
            setSelectedRecipe(prevRecipe => prevRecipe && prevRecipe.recipeIdx === recipeId ? response.data : prevRecipe); // 상세 페이지에서 좋아요 처리 후 업데이트
        } catch (error) {
            setError(error.message || '좋아요 처리 중 오류가 발생했습니다.');
            console.error(error);
        }
    };

    const changePage = (newPage) => {
        setPage(newPage);
        searchRecipes('', '', newPage, size); // 페이지 변경 시 레시피 목록 다시 불러오기
    };


    const createComment = async (recipeId, content) => {
        try {
            const response = await axios.post(`/api/recipes/${recipeId}/comments`, { recipeContent: content });
            getRecipeById(recipeId);
        } catch (error) {
            setError(error.message || '댓글 작성 실패');
        }
    };

    const updateComment = async (commentId, updatedContent) => {
        try {
            const response = await axios.patch(`/api/recipes/comments/${commentId}`, { recipeContent: updatedContent });
            if (selectedRecipe && selectedRecipe.recipeIdx === commentId) {
                getRecipeById(selectedRecipe.recipeIdx);
            }
        } catch (error) {
            setError(error.message || '댓글 수정 실패');
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await axios.delete(`/api/recipes/comments/${commentId}`);
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
            createComment, updateComment, deleteComment,
            setSelectedRecipe
        }}>
            {children}
        </RecipeContext.Provider>
    );
};

export default RecipeContext;
