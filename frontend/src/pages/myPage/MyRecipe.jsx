import React, { useEffect, useState } from 'react';
import PageHeader from "../../components/layout/PageHeader";
import axios from '../../utils/axios';
import '../../assets/style/myPage/MyRecipe.css';
import RecipeCard from '../../pages/recipe/RecipeCard';
import {ClipLoader} from "react-spinners";

/**
 * MyRecipe 컴포넌트
 * - 사용자가 작성한 레시피 목록을 보여주는 페이지입니다.
 * - 페이지네이션을 적용하여 사용자가 작성한 레시피를 페이지별로 불러옵니다.
 */
function MyRecipe() {
    const [myRecipes, setMyRecipes] = useState([]); // 사용자가 작성한 레시피 목록 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null);  // 오류 상태
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 상태

    /**
     * useEffect 훅
     * - currentPage가 변경될 때마다 실행됩니다.
     * - 작성한 레시피 목록을 현재 페이지에 맞게 API로부터 불러옵니다.
     */
    useEffect(() => {
        const fetchMyRecipes = async () => {
            const token = localStorage.getItem("token"); // 인증 토큰을 로컬 스토리지에서 가져옴
            const userIdx = localStorage.getItem("userIdx");  // 사용자 ID를 로컬 스토리지에서 가져옴

            try {
                const response = await axios.get(`/api/recipes/user/${userIdx}`, {
                    params: { page: currentPage, size: 10 }, // 페이지네이션 요청 매개변수
                    headers: {
                        'Authorization': `Bearer ${token}` // 인증 헤더 설정
                    }
                });

                // API 응답 데이터를 상태에 저장
                setMyRecipes(response.data.content); // 페이지네이션된 레시피 목록 설정
                setTotalPages(response.data.totalPages); // 전체 페이지 수 설정
            } catch (error) {
                // 오류 발생 시 오류 메시지를 설정
                setError(error.message || '작성한 레시피를 불러오는 중 오류가 발생했습니다.');
            } finally {
                // 로딩 상태를 비활성화
                setLoading(false);
            }
        };

        fetchMyRecipes(); // 작성한 레시피 불러오기
    }, [currentPage]); // currentPage가 변경될 때마다 재실행

    /**
     * handlePageChange 함수
     * - 페이지 번호를 클릭했을 때 해당 페이지로 이동합니다.
     * @param {number} page - 이동할 페이지 번호
     */
    const handlePageChange = (page) => {
        setCurrentPage(page); // 페이지 상태 업데이트
    };

    /**
     * handleRecipeDelete 함수
     * - 특정 레시피가 삭제된 후 상태에서 해당 레시피를 제거합니다.
     * @param {number} deletedRecipeIdx - 삭제된 레시피의 ID
     */
    const handleRecipeDelete = (deletedRecipeIdx) => {
        setMyRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.recipeIdx !== deletedRecipeIdx));
    };

    /**
     * handleRecipeLike 함수
     * - 좋아요 상태가 변경된 레시피를 상태에 반영합니다.
     * @param {object} updatedRecipe - 좋아요 상태가 변경된 레시피 객체
     */
    const handleRecipeLike = (updatedRecipe) => {
        setMyRecipes(prevRecipes =>
            prevRecipes.map(recipe =>
                recipe.recipeIdx === updatedRecipe.recipeIdx ? updatedRecipe : recipe
            )
        );
    };

    // 로딩 중이면 로딩 스피너를 표시
    if (loading) return <div className="loading-spinner">
        <ClipLoader size={50} color={"#123abc"} loading={loading}/>
    </div>;

    // 오류가 발생하면 오류 메시지를 표시
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="myRecipe-main">
            {/* 상단 페이지 헤더 */}
            <PageHeader title="작성한 레시피"/>
            <div className="recipe-list">
                {myRecipes.length > 0 ? (
                    myRecipes.map(recipe => (
                        <div key={recipe.recipeIdx} className="recipe-list-item">
                            {/* 각 레시피를 RecipeCard 컴포넌트로 렌더링, 삭제와 좋아요 처리 함수 전달 */}
                            <RecipeCard recipe={recipe}
                                        onDelete={handleRecipeDelete}
                                        onLike={handleRecipeLike}/>
                        </div>
                    ))
                ) : (
                    <div className="no-recipes-message">작성한 레시피가 없습니다.</div>
                )}
            </div>
            {/* 페이지네이션 버튼 */}
            <div className="pagination myRecipe">
                {/* 첫 페이지로 이동 버튼 */}
                <button
                    onClick={() => handlePageChange(0)} // 첫 페이지로 이동
                    disabled={currentPage === 0} // 첫 페이지에서는 비활성화
                >
                    &laquo;
                </button>

                {/* 이전 페이지로 이동 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)} // 이전 페이지로 이동
                    disabled={currentPage === 0} // 첫 페이지에서는 비활성화
                >
                    &lsaquo;
                </button>

                {/* 현재 페이지 주변의 다섯 개의 페이지 번호만 표시 */}
                {[...Array(totalPages)].slice(
                    Math.max(0, currentPage - 2),
                    Math.min(totalPages, currentPage + 3)
                ).map((_, i) => {
                    const pageNumber = Math.max(0, currentPage - 2) + i;
                    return (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)} // 페이지 변경 핸들러 호출
                            className={pageNumber === currentPage ? 'active' : ''}  // 현재 페이지는 활성화된 스타일 적용
                        >
                            {pageNumber + 1} {/* 페이지 번호 표시 */}
                        </button>
                    );
                })}

                {/* 다음 페이지로 이동 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)} // 다음 페이지로 이동
                    disabled={currentPage === totalPages - 1} // 마지막 페이지에서는 비활성화
                >
                    &rsaquo;
                </button>

                {/* 마지막 페이지로 이동 버튼 */}
                <button
                    onClick={() => handlePageChange(totalPages - 1)} // 마지막 페이지로 이동
                    disabled={currentPage === totalPages - 1} // 마지막 페이지에서는 비활성화
                >
                    &raquo;
                </button>
            </div>
        </div>

    );
}

export default MyRecipe;