import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

const RecipeContext = createContext({
    recipes: [],
    selectedRecipe: null,
    loading: true,
    error: null,
    searchRecipes: () => { },
    getRecipeById: () => { },
    aiRecommendRecipes: () => {},
    getUserRecommendedRecipes: () => {},
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
    setSelectedRecipe: () => { },
    setError: () => {},
    categoryRecipes: [],
    latestRecipes: [],
    setCategoryRecipes: () => {},
    setLatestRecipes: () => {},
    searchedRecipes: [],
    userRecommendedRecipes: [],
    setSearchedRecipes: () => {},
    setUserRecommendedRecipes: () => {}, // 추가
    totalRecipes: 0, // 전체 레시피 개수
    setTotalRecipes: () => {}, // 전체 레시피 개수를 설정하는 함수
    recipeCategory: [],
    formatViewsCount: () => {},
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
    const [categoryRecipes, setCategoryRecipes] = useState([]); // 카테고리별 레시피
    const [latestRecipes, setLatestRecipes] = useState([]); // 최신 레시피
    const [userRecommendedRecipes, setUserRecommendedRecipes] = useState([]);
    const [searchedRecipes, setSearchedRecipes] = useState([]);
    const [totalRecipes, setTotalRecipes] = useState(0); // 전체 레시피 개수
    const navigate = useNavigate();

    const loadTotalRecipesCount = useCallback(async () => {
        try {
            const response = await axios.get('/api/recipes/count');
            console.log('Fetched totalRecipes from server:', response.data);
            setTotalRecipes(response.data);
        } catch (error) {
            setError('전체 레시피 수를 불러오는 중 오류가 발생했습니다.');
        }
    }, [setTotalRecipes, setError]);

    useEffect(() => {
        loadTotalRecipesCount();
        console.log('Total recipes count effect executed.');
    }, [loadTotalRecipesCount]);



    // 레시피 검색 함수 (useCallback으로 메모이징)
    const searchRecipes = useCallback(async (keyword = '', category = '', page = 0, size = 10, sort = 'createdAt,desc') => {
        try {
            setLoading(true);
            const response = await axios.get('/api/recipes/search', {
                params: { keyword, category, page, size, sort }
            });
            setSearchedRecipes(response.data.content); // 검색 결과를 searchedRecipes에 저장
            setTotalElements(response.data.totalElements || 0);
            setTotalPages(response.data.totalPages || 0);
            setPage(response.data.number);
            setSize(response.data.size);
        } catch (error) {
            if (error.redirectTo) {
                navigate(error.redirectTo);
            } else {
                setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        searchRecipes('', '', page, size); // 토큰 확인 없이 레시피 목록 요청
        getUserRecommendedRecipes(); // 초기에는 유저 추천 레시피만 로드
    }, [page, size, searchRecipes]);


    const getLatestRecipes = async () => {
        try {
            const response = await axios.get('/api/recipes/latest', {
                params: { page: 0, size: 20 }
            });
            setLatestRecipes(response.data.content);
            setTotalRecipes(response.data.totalElements);  // 전체 레시피 수를 설정
        } catch (error) {
            setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
        }
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

    // 레시피 상세 정보 조회 함수
    const getRecipeById = useCallback(async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/recipes/${id}`);
            setSelectedRecipe(response.data);
            return response.data;

        } catch (error) {
            setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [setSelectedRecipe, setError]);

    // AI 레시피 추천 함수
    const aiRecommendRecipes = async (ingredients) => {
        try {
            const response = await axios.post('/api/recipes/recommend', { ingredients });
            setRecipes(response.data); // AI 추천 결과를 recipes 상태에 저장
        } catch (error) {
            setError(error.message || 'AI 추천 중 오류가 발생했습니다.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // 유저 추천 레시피 함수
    const getUserRecommendedRecipes = async () => {
        try {
            const response = await axios.get('/api/recipes/recommended');
            setUserRecommendedRecipes(response.data); // 유저 추천 레시피를 userRecommendedRecipes에 저장
        } catch (error) {
            setError(error.message || '유저 추천 레시피를 불러오는 중 오류가 발생했습니다.');
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
            localStorage.removeItem('recommendedRecipes');
            setSelectedRecipe(null); // 상세 페이지를 닫거나 다른 페이지로 이동
        } catch (error) {
            setError(error.message || '레시피 삭제에 실패했습니다.');
            console.error(error);
        }
    };

    const likeRecipe = async (recipeId) => {
        try {
            await axios.post(`/api/recipes/${recipeId}/like`);
        } catch (error) {
            setError(error.message || '좋아요 처리 중 오류가 발생했습니다.');
            console.error(error);
        }
    };
    // 페이지 변경 함수
    const changePage = (newPage) => {
        setPage(newPage);
        searchRecipes('', '', newPage, size);
    };

    // 댓글 생성 함수
    const createComment = async (recipeId, content) => {
        try {
            const response = await axios.post(`/api/recipes/${recipeId}/comments`, { recipeContent: content });
            setSelectedRecipe(prevRecipe => {
                if (prevRecipe.recipeIdx === recipeId) {
                    return {
                        ...prevRecipe,
                        comments: [...prevRecipe.comments, response.data]
                    };
                }
                return prevRecipe;
            });
        } catch (error) {
            setError(error.message || '댓글 작성 실패');
        }
    };

    // 댓글 수정 함수
    const updateComment = async (recipeId, commentId, updatedContent) => {
        try {
            const response = await axios.put(`/api/recipes/${recipeId}/comments/${commentId}`, { recipeContent: updatedContent });
            setSelectedRecipe(prevRecipe => {
                const updatedComments = prevRecipe.comments.map(comment =>
                    comment.recipeCommentIdx === commentId ? response.data : comment
                );
                return { ...prevRecipe, comments: updatedComments };
            });
        } catch (error) {
            setError(error.message || '댓글 수정 실패');
        }
    };

    // 댓글 삭제 함수
    const deleteComment = async (recipeId, commentId) => {
        try {
            await axios.delete(`/api/recipes/${recipeId}/comments/${commentId}`);
            setSelectedRecipe(prevRecipe => {
                const updatedComments = prevRecipe.comments.filter(comment => comment.recipeCommentIdx !== commentId);
                return { ...prevRecipe, comments: updatedComments };
            });
        } catch (error) {
            setError(error.message || '댓글 삭제 실패');
        }
    };

    // categoryButtons 배열 정의
    const recipeCategory = [
        { name: '한식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-korean-food.jpg', category: '한식', id: 'korean'},
        { name: '양식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-japanese-food.jpg', category: '양식', id: 'western' },
        { name: '일식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-western-food.jpg', category: '일식', id: 'japanese' },
        { name: '중식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-chinese-food.jpg', category: '중식', id: 'chinese' },
    ];

    // viewsCount 포맷팅 로직
    const formatViewsCount = (viewsCount) => {
        if (viewsCount >= 1000) {
            return (viewsCount / 1000).toFixed(1) + 'k';
        }
        return viewsCount;
    };

    return (
        <RecipeContext.Provider value={{
            recipes, selectedRecipe, loading, error,
            searchRecipes, getRecipeById,
            createRecipe, updateRecipe, deleteRecipe, likeRecipe,
            totalElements, totalPages, page, size, changePage,
            createComment, updateComment, deleteComment,
            setSelectedRecipe, setError, latestRecipes,
            setLatestRecipes,
            getLatestRecipes,
            getRecipesByCategory,
            getUserRecommendedRecipes,
            aiRecommendRecipes,
            navigate,
            setLoading,
            categoryRecipes,
            setCategoryRecipes,
            userRecommendedRecipes,
            searchedRecipes,
            setUserRecommendedRecipes,
            setSearchedRecipes,
            totalRecipes, // 전체 레시피 개수
            setTotalRecipes, // 전체 레시피 개수 설정 함수
            recipeCategory,
            formatViewsCount,
        }}>
            {children}
        </RecipeContext.Provider>
    );
};

export default RecipeContext;
