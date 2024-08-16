import React, { useEffect, useState } from 'react';
import PageHeader from "../../components/layout/PageHeader";
import axios from '../../utils/axios';
import '../../assets/style/myPage/MyRecipe.css';
import RecipeCard from '../../pages/recipe/RecipeCard';

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="myRecipe-main">
            <PageHeader title="작성한 레시피" />
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
            <div className="pagination">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={i === currentPage ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MyRecipe;