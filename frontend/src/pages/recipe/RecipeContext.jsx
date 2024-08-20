import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import {clearRecipeLocalStorage} from "../../utils/localStorageUtils";
/**
 * RecipeContext
 * - 레시피 데이터를 관리하고 다양한 레시피 관련 기능을 제공하기 위한 컨텍스트
 * - 기본값은 빈 배열, 함수들로 설정되어 있으며, 실제 데이터는 Provider에서 제공됨
 */
const RecipeContext = createContext({
    recipes: [], // 레시피 목록
    selectedRecipe: null, // 선택된 레시피 정보
    loading: true, // 로딩 상태
    error: null, // 에러 상태
    getRecipeById: () => { },  // 레시피 상세 조회 함수
    createRecipe: () => { },
    updateRecipe: () => { }, // 레시피 업데이트 함수
    deleteRecipe: () => { }, // 레시피 삭제 함수
    likeRecipe: () => { },  // 레시피 좋아요 함수
    totalElements: 0,  // 전체 레시피 요소 개수
    totalPages: 0, // 전체 페이지 개수
    page: 0,  // 현재 페이지 번호
    size: 10,  // 페이지당 레시피 개수
    createComment: () => { },  // 댓글 생성 함수
    updateComment: () => { },  // 댓글 업데이트 함수
    deleteComment: () => { },  // 댓글 삭제 함수
    setSelectedRecipe: () => { }, // 선택된 레시피 설정 함수
    setError: () => {},  // 에러 설정 함수
    latestRecipes: [],  // 최신 레시피 목록
    setLatestRecipes: () => {},  // 최신 레시피 설정 함수
    userRecommendedRecipes: [], // 유저 추천 레시피 목록
    totalRecipes: 0, // 전체 레시피 개수
    recipeCategory: [],  // 레시피 카테고리
    formatViewsCount: () => {}, // 조회수 포맷 함수
});

/**
 * RecipeProvider 컴포넌트
 * - RecipeContext를 통해 자식 컴포넌트에 레시피 관련 데이터와 기능을 제공하는 Provider 컴포넌트
 */
export const RecipeProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]); // 레시피 목록 상태
    const [selectedRecipe, setSelectedRecipe] = useState(null);  // 선택된 레시피 상태
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [totalElements, setTotalElements] = useState(0); // 전체 요소 개수
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 개수
    const [page, setPage] = useState(0);  // 현재 페이지 상태
    const [size, setSize] = useState(10); // 페이지 당 레시피 개수 상태
    const [categoryRecipes, setCategoryRecipes] = useState([]); // 카테고리별 레시피 상태
    const [latestRecipes, setLatestRecipes] = useState([]); // 최신 레시피 상태
    const [userRecommendedRecipes, setUserRecommendedRecipes] = useState([]); // 유저 추천 레시피 상태
    const [searchedRecipes, setSearchedRecipes] = useState([]);  // 검색된 레시피 상태
    const [totalRecipes, setTotalRecipes] = useState(0); // 전체 레시피 개수 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    /**
     * 전체 레시피 개수를 서버에서 불러오는 함수
     * - 서버에서 전체 레시피의 개수를 조회하여 상태로 저장
     */
    const loadTotalRecipesCount = useCallback(async () => {
        try {
            const response = await axios.get('/api/recipes/count');
            console.log('Fetched totalRecipes from server:', response.data);
            setTotalRecipes(response.data);   // 서버에서 받아온 전체 레시피 개수 저장
        } catch (error) {
            setError('전체 레시피 수를 불러오는 중 오류가 발생했습니다.');
        }
    }, [setTotalRecipes, setError]);

    // 컴포넌트가 처음 렌더링될 때 전체 레시피 개수를 불러옴
    useEffect(() => {
        loadTotalRecipesCount();  // 전체 레시피 개수를 서버에서 로드
        console.log('Total recipes count effect executed.');
    }, [loadTotalRecipesCount]);


    // 초기 로드 시 레시피 목록과 유저 추천 레시피를 불러옴
    useEffect(() => {
        getUserRecommendedRecipes(); // 초기에는 유저 추천 레시피만 로드
    }, [page, size]);

    /**
     * 최신 레시피 목록을 불러오는 함수
     * - 최신 레시피를 불러와 상태로 저장
     */
    const getLatestRecipes = async () => {
        try {
            const response = await axios.get('/api/recipes/latest', {
                params: { page: 0, size: 20 }
            });
            setLatestRecipes(response.data.content); // 최신 레시피 저장
            setTotalRecipes(response.data.totalElements);  // 전체 레시피 수를 설정
        } catch (error) {
            setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
        }
    };

    /**
     * 카테고리별 레시피 목록을 불러오는 함수
     * - 특정 카테고리의 레시피를 불러와 상태로 저장
     * @param {string} category - 불러올 카테고리
     */
    const getRecipesByCategory = async (category) => {
        try {
            const response = await axios.get('/api/recipes/search', {
                params: { category, page: 0, size: 4, sort: 'createdAt,desc' }
            });
            setCategoryRecipes(response.data.content);  // 카테고리별 레시피 저장
        } catch (error) {
            setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
        }
    };

    /**
     * 레시피 상세 정보 조회 함수
     * - 특정 레시피의 상세 정보를 서버에서 받아와 상태로 저장
     * @param {number} id - 조회할 레시피의 ID
     * @returns {Promise<object>} - 조회된 레시피 데이터
     */
    const getRecipeById = useCallback(async (id) => {
        try {
            setLoading(true);  // 로딩 상태 설정
            const response = await axios.get(`/api/recipes/${id}`);
            setSelectedRecipe(response.data); // 선택된 레시피 저장
            return response.data;

        } catch (error) {
            setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
            console.error(error);
        } finally {
            setLoading(false); // 로딩 완료 상태 설정
        }
    }, [setSelectedRecipe, setError]);

    // 유저 추천 레시피 함수
    const getUserRecommendedRecipes = async () => {
        try {
            const response = await axios.get('/api/recipes/recommended');
            setUserRecommendedRecipes(response.data); // 유저 추천 레시피 저장
        } catch (error) {
            setError(error.message || '유저 추천 레시피를 불러오는 중 오류가 발생했습니다.');
            console.error(error);
        } finally {
            setLoading(false);  // 로딩 완료 상태 설정
        }
    };

    /**
     * 레시피 생성 함수
     * - 사용자가 입력한 레시피 데이터를 서버로 전송하여 새로운 레시피를 생성하는 역할을 함.
     * - 서버에 성공적으로 데이터를 전송한 후에는, 상태를 업데이트하여 새로운 레시피를 리스트에 추가하고,
     *   생성된 레시피의 상세 페이지로 리다이렉트하며, 로컬 스토리지를 초기화함.
     * @param {Object} recipeData - 생성할 레시피의 데이터 객체 (제목, 내용, 이미지 등 포함)
     */
    const createRecipe = async (recipeData) => {
        try {
            // 서버로 레시피 생성 요청을 전송하고, 응답으로 생성된 레시피 데이터를 받음
            const response = await axios.post('/api/recipes', recipeData);
            // 새롭게 생성된 레시피를 기존 레시피 리스트에 추가하여 상태 업데이트
            setRecipes([response.data, ...recipes]);
            // 생성된 레시피의 상세 페이지로 리다이렉트
            navigate(`/recipe/${response.data.recipeIdx}`);
            // 로컬 스토리지 초기화 (이전 검색 및 데이터 캐시 제거)
            clearRecipeLocalStorage();
        } catch (error) {
            setError(error.message || '레시피 등록에 실패했습니다.');
            console.error(error);
        }
    };

    /**
     * 레시피 수정 함수
     * - 특정 레시피를 수정하기 위해 서버로 수정된 레시피 데이터를 전송하는 함수.
     * - 수정된 레시피 데이터를 수신한 후에는, 해당 레시피를 리스트에서 업데이트하고 상태를 변경함.
     * @param {number} recipeId - 수정할 레시피의 고유 ID
     * @param {Object} recipeData - 수정된 레시피 데이터 객체
     */
    const updateRecipe = async (recipeId, recipeData) => {
        try {
            // 서버로 수정된 레시피 데이터를 전송하고, 응답으로 업데이트된 레시피 데이터를 받음
            const response = await axios.put(`/api/recipes/${recipeId}`, recipeData);
            // 레시피 리스트에서 해당 레시피를 찾아 업데이트하고 상태를 반영
            setRecipes(recipes.map(recipe => (recipe.recipeIdx === recipeId ? response.data : recipe)));
            // 선택된 레시피 데이터를 업데이트하여 상태를 반영
            setSelectedRecipe(response.data);
        } catch (error) {
            // 레시피 수정 중 오류 발생 시, 오류 메시지 설정 및 콘솔에 오류 출력
            setError(error.message || '레시피 수정에 실패했습니다.');
            console.error(error);
        }
    };

    /**
     * 레시피 삭제 함수
     * - 특정 레시피를 서버에서 삭제하는 함수.
     * - 서버에서 삭제가 성공하면 상태를 업데이트하여 레시피 목록에서 해당 레시피를 제거하고, 로컬 스토리지의 관련 데이터를 삭제함.
     * @param {number} id - 삭제할 레시피의 고유 ID
     */
    const deleteRecipe = async (id) => {
        try {
            // 로컬 스토리지에서 토큰을 가져와 요청 헤더에 추가
            const token = localStorage.getItem('token');
            // 서버로 해당 레시피 삭제 요청을 전송
            await axios.delete(`/api/recipes/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Bearer 인증 헤더에 토큰 추가
                },
            });
            // 삭제된 레시피를 목록에서 제거하고 상태 업데이트
            setRecipes(recipes.filter(recipe => recipe.recipeIdx !== id));
            // 로컬 스토리지에서 추천 레시피 데이터 제거
            localStorage.removeItem('recommendedRecipes');
            // 선택된 레시피 상태를 초기화하여 상세 페이지에서 빈 상태로 설정
            setSelectedRecipe(null);
        } catch (error) {
            // 레시피 삭제 중 오류 발생 시, 오류 메시지 설정 및 콘솔에 오류 출력
            setError(error.message || '레시피 삭제에 실패했습니다.');
            console.error(error);
        }
    };

    /**
     * 레시피 좋아요 함수
     * - 사용자가 특정 레시피에 대해 좋아요(Like)를 추가하거나 제거하는 역할을 수행하는 함수.
     * - 서버로 좋아요 요청을 전송하고, 상태 변화는 서버에서 처리함.
     * @param {number} recipeId - 좋아요를 누를 레시피의 고유 ID
     */
    const likeRecipe = async (recipeId) => {
        try {
            // 서버로 해당 레시피 좋아요 요청을 전송
            await axios.post(`/api/recipes/${recipeId}/like`);  // 좋아요 처리
        } catch (error) {
            // 좋아요 처리 중 오류 발생 시, 오류 메시지 설정 및 콘솔에 오류 출력
            setError(error.message || '좋아요 처리 중 오류가 발생했습니다.');
            console.error(error);
        }
    };


    /**
     * 댓글 생성 함수
     * - 사용자가 특정 레시피에 대해 댓글을 작성하고 서버로 전송하는 함수.
     * - 댓글이 성공적으로 생성되면, 해당 레시피의 댓글 목록에 새로운 댓글을 추가함.
     * @param {number} recipeId - 댓글을 작성할 레시피의 고유 ID
     * @param {string} content - 댓글 내용
     */
    const createComment = async (recipeId, content) => {
        try {
            // 서버로 댓글 생성 요청을 전송하고, 응답으로 생성된 댓글 데이터를 받음
            const response = await axios.post(`/api/recipes/${recipeId}/comments`, { recipeContent: content });
            // 선택된 레시피 상태를 업데이트하여 새로운 댓글을 추가함
            setSelectedRecipe(prevRecipe => {
                if (prevRecipe.recipeIdx === recipeId) {
                    return {
                        ...prevRecipe,
                        comments: [...prevRecipe.comments, response.data] // 댓글 목록에 새로운 댓글 추가
                    };
                }
                return prevRecipe;
            });
        } catch (error) {
            // 댓글 생성 중 오류 발생 시, 오류 메시지 설정
            setError(error.message || '댓글 작성 실패');
        }
    };

    /**
     * 댓글 수정 함수
     * - 사용자가 작성한 특정 댓글의 내용을 수정하고 서버로 전송하는 함수.
     * - 수정된 댓글 데이터를 수신한 후, 해당 레시피의 댓글 목록에서 수정된 내용을 반영함.
     * @param {number} recipeId - 댓글이 속한 레시피의 고유 ID
     * @param {number} commentId - 수정할 댓글의 고유 ID
     * @param {string} updatedContent - 수정된 댓글 내용
     */
    const updateComment = async (recipeId, commentId, updatedContent) => {
        try {
            // 서버로 댓글 수정 요청을 전송하고, 응답으로 수정된 댓글 데이터를 받음
            const response = await axios.put(`/api/recipes/${recipeId}/comments/${commentId}`, { recipeContent: updatedContent });
            // 선택된 레시피 상태를 업데이트하여 수정된 댓글을 반영함
            setSelectedRecipe(prevRecipe => {
                const updatedComments = prevRecipe.comments.map(comment =>
                    comment.recipeCommentIdx === commentId ? response.data : comment
                );
                return { ...prevRecipe, comments: updatedComments }; // 수정된 댓글 반영
            });
        } catch (error) {
            // 댓글 수정 중 오류 발생 시, 오류 메시지 설정
            setError(error.message || '댓글 수정 실패');
        }
    };

    /**
     * 댓글 삭제 함수
     * - 사용자가 작성한 특정 댓글을 삭제하고 서버로 요청을 전송하는 함수.
     * - 댓글이 성공적으로 삭제되면, 해당 레시피의 댓글 목록에서 해당 댓글을 제거함.
     * @param {number} recipeId - 댓글이 속한 레시피의 고유 ID
     * @param {number} commentId - 삭제할 댓글의 고유 ID
     */
    const deleteComment = async (recipeId, commentId) => {
        try {
            // 서버로 댓글 삭제 요청을 전송
            await axios.delete(`/api/recipes/${recipeId}/comments/${commentId}`);
            // 선택된 레시피 상태를 업데이트하여 댓글 목록에서 삭제된 댓글을 제거함
            setSelectedRecipe(prevRecipe => {
                const updatedComments = prevRecipe.comments.filter(comment => comment.recipeCommentIdx !== commentId);
                return { ...prevRecipe, comments: updatedComments };  // 삭제된 댓글 반영
            });
        } catch (error) {
            // 댓글 삭제 중 오류 발생 시, 오류 메시지 설정
            setError(error.message || '댓글 삭제 실패');
        }
    };

    // 레시피 카테고리 배열 정의
    const recipeCategory = [
        { name: '한식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-korean-food.jpg', category: '한식', id: 'korean'},
        { name: '양식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-japanese-food.jpg', category: '양식', id: 'western' },
        { name: '일식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-western-food.jpg', category: '일식', id: 'japanese' },
        { name: '중식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-chinese-food.jpg', category: '중식', id: 'chinese' },
    ];

    // 조회수 포맷팅 함수 (예: 1000 이상일 경우 '1k'로 변환)
    const formatViewsCount = (viewsCount) => {
        if (viewsCount >= 1000) {
            return (viewsCount / 1000).toFixed(1) + 'k';
        }
        return viewsCount;
    };

    return (
        <RecipeContext.Provider value={{
            recipes, selectedRecipe, loading, error,
            getRecipeById,
            createRecipe, updateRecipe, deleteRecipe, likeRecipe,
            totalElements, totalPages, page, size,
            createComment, updateComment, deleteComment,
            setSelectedRecipe, setError, latestRecipes,
            setLatestRecipes,
            getLatestRecipes,
            getRecipesByCategory,
            getUserRecommendedRecipes,
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
            formatViewsCount
        }}>
            {children}
        </RecipeContext.Provider>
    );
};

export default RecipeContext;
