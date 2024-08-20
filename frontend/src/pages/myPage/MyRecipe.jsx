import React, { useEffect, useState } from 'react';
import PageHeader from "../../components/layout/PageHeader";
import axios from '../../utils/axios';
import '../../assets/style/myPage/MyRecipe.css';
import RecipeCard from '../../pages/recipe/RecipeCard';
import {ClipLoader} from "react-spinners";

function MyRecipe() {
    const [myRecipes, setMyRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchMyRecipes = async () => {
            const token = localStorage.getItem("token");
            const userIdx = localStorage.getItem("userIdx");

            try {
                const response = await axios.get(`/api/recipes/user/${userIdx}`, {
                    params: { page: currentPage, size: 10 }, // 페이지네이션 적용
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setMyRecipes(response.data.content); // 페이지네이션된 레시피 목록 설정
                setTotalPages(response.data.totalPages); // 전체 페이지 수 설정
            } catch (error) {
                setError(error.message || '작성한 레시피를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyRecipes();
    }, [currentPage]); // currentPage가 변경될 때마다 호출

    const handlePageChange = (page) => {
        setCurrentPage(page); // 페이지 변경
    };

    const handleRecipeDelete = (deletedRecipeIdx) => {
        setMyRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.recipeIdx !== deletedRecipeIdx));
    };

    const handleRecipeLike = (updatedRecipe) => {
        setMyRecipes(prevRecipes =>
            prevRecipes.map(recipe =>
                recipe.recipeIdx === updatedRecipe.recipeIdx ? updatedRecipe : recipe
            )
        );
    };

    if (loading) return <div className="loading-spinner">
        <ClipLoader size={50} color={"#123abc"} loading={loading}/>
    </div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="myRecipe-main">
            <PageHeader title="작성한 레시피"/>
            <div className="recipe-list">
                {myRecipes.length > 0 ? (
                    myRecipes.map(recipe => (
                        <div key={recipe.recipeIdx} className="recipe-list-item">
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
            <div className="pagination">
                {/* 첫 페이지로 이동 버튼 */}
                <button
                    onClick={() => handlePageChange(0)} // 첫 페이지로 이동
                    disabled={currentPage === 0} // 첫 페이지에서는 비활성화
                >
                    &laquo; 첫 페이지
                </button>

                {/* 이전 페이지로 이동 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)} // 이전 페이지로 이동
                    disabled={currentPage === 0} // 첫 페이지에서는 비활성화
                >
                    &lsaquo; 이전
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
                    다음 &rsaquo;
                </button>

                {/* 마지막 페이지로 이동 버튼 */}
                <button
                    onClick={() => handlePageChange(totalPages - 1)} // 마지막 페이지로 이동
                    disabled={currentPage === totalPages - 1} // 마지막 페이지에서는 비활성화
                >
                    마지막 페이지 &raquo;
                </button>
            </div>
        </div>

    );
}

export default MyRecipe;