import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/layout/PageHeader";
import axios from '../../utils/axios';
import '../../assets/style/myPage/MyLikeRecipe.css';
import RecipeCard from '../../pages/recipe/RecipeCard';

function MyLikeRecipe() {
    const [likedRecipes, setLikedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);



    // 페이지가 변경될 때마다 좋아요한 레시피를 불러오는 함수
    useEffect(() => {
        const fetchLikedRecipes = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await axios.get(`/api/recipes/liked`, {
                    params: { page: currentPage, size: 10 }, // 페이지네이션 적용
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // 좋아요한 레시피 목록을 설정
                setLikedRecipes(response.data.content); // 페이지네이션된 레시피 목록 설정
                setTotalPages(response.data.totalPages); // 전체 페이지 수 설정
            } catch (error) {
                setError(error.message || '좋아요한 레시피를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchLikedRecipes();
    }, [currentPage]); // currentPage가 변경될 때마다 호출

    const handlePageChange = (page) => {
        setCurrentPage(page); // 페이지 변경
        window.scrollTo(0,0);
    };



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="myLikeRecipe-main">
            <PageHeader title="좋아요 레시피" />
            <div className="recipe-list">
                {likedRecipes && likedRecipes.length > 0 ? (
                    likedRecipes.map(recipe => (
                        <div key={recipe.recipeIdx} className="recipe-list-item">
                            <RecipeCard recipe={recipe}/>
                        </div>
                    ))
                ) : (
                    <div className="no-recipes-message">좋아요 한 레시피가 없습니다.</div>
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

export default MyLikeRecipe;
