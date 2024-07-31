// src/context/RecipeContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 레시피 관련 데이터와 함수들을 전달하는 Context 객체 생성
const RecipeContext = createContext({
    recipes: [], // 레시피 목록 데이터
    selectedRecipe: null, // 현재 선택된 레시피 상세 정보
    loading: true, // 데이터 로딩 상태
    error: null, // 에러 메시지
    searchRecipes: () => {}, // 레시피 검색 함수
    getRecipeById: () => {}, // 레시피 ID로 레시피 조회 함수
    recommendRecipes: () => {}, // AI 레시피 추천 함수
    createRecipe: () => {}, // 레시피 생성 함수
    updateRecipe: () => {}, // 레시피 수정 함수
    deleteRecipe: () => {}, // 레시피 삭제 함수
    likeRecipe: () => {}, // 레시피 좋아요 토글 함수
    totalElements: 0, // 전체 레시피 개수
    totalPages: 0, // 전체 페이지 수
    page: 0, // 현재 페이지 번호
    size: 10, // 페이지당 레시피 개수
    changePage: () => {}, // 페이지 변경 함수
    createComment: () => {}, // 댓글 생성 함수
    updateComment: () => {}, // 댓글 수정 함수
    deleteComment: () => {}, // 댓글 삭제 함수
    setSelectedRecipe: () => {} // 선택된 레시피 설정 함수
});

export const RecipeProvider = ({ children }) => {
    // 상태 변수 초기값 설정
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const navigate = useNavigate();




    // 레시피 검색 함수
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
            // 에러 처리 (401 Unauthorized 에러는 로그인 페이지로 리다이렉트)
            if (error.response && error.response.status === 401) {
                navigate('/login');
            } else {
                setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }

        searchRecipes('', '', page, size); // 토큰이 있으면 레시피 목록 요청
    }, [page, size, searchRecipes]); // searchRecipes 추가

    // 레시피 상세 정보 조회 함수
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

    // AI 레시피 추천 함수
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

    // 레시피 생성 함수
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

    // 레시피 삭제 함수
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
// 좋아요 처리 함수
    const likeRecipe = async (recipeId) => {
        try {
            const response = await axios.post(`/api/recipes/${recipeId}/likes`);
            setRecipes(recipes.map(recipe => (recipe.recipeIdx === recipeId ? response.data : recipe)));
            setSelectedRecipe(prevRecipe => prevRecipe && prevRecipe.recipeIdx === recipeId ? response.data : prevRecipe);
        } catch (error) {
            setError(error.message || '좋아요 처리 중 오류가 발생했습니다.');
            console.error(error);
        }
    };

    // 페이지 변경 함수
    const changePage = (newPage) => {
        setPage(newPage);
        searchRecipes('', '', newPage, size); //  sortBy 제거
    };

    // 댓글 생성 함수
    const createComment = async (recipeId, content) => {
        try {
            await axios.post(`/api/recipes/${recipeId}/comments`, { recipeContent: content });
            // 댓글 작성 후, 레시피 상세 정보를 다시 불러오기 (response 사용)
            await getRecipeById(recipeId);
        } catch (error) {
            setError(error.message || '댓글 작성 실패');
        }
    };

    // 댓글 수정 함수
    const updateComment = async (commentId, updatedContent) => {
        try {
            await axios.patch(`/api/recipes/comments/${commentId}`, { recipeContent: updatedContent });
            // 댓글 수정 후, 레시피 상세 정보를 다시 불러오기 (response 사용)
            if (selectedRecipe && selectedRecipe.recipeIdx === commentId) {
                await getRecipeById(selectedRecipe.recipeIdx);
            }
        } catch (error) {
            setError(error.message || '댓글 수정 실패');
        }
    };

    // 댓글 삭제 함수
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

    // RecipeContext 값 제공
    return (
        <RecipeContext.Provider value={{
            recipes, selectedRecipe, loading, error,
            searchRecipes, getRecipeById, recommendRecipes,
            createRecipe, updateRecipe, deleteRecipe, likeRecipe,
            totalElements, totalPages, page, size, changePage,
            createComment,
            updateComment, deleteComment,
            setSelectedRecipe
        }}>
            {children}
        </RecipeContext.Provider>
    );
};

export default RecipeContext;
