import React, { useEffect, useState } from 'react';
import PageHeader from "../../components/layout/PageHeader";
import axios from '../../utils/axios';
import '../../assets/style/myPage/MyLikeRecipe.css';
import RecipeCard from '../../pages/recipe/RecipeCard';

function MyLikeRecipe() {
    const [likedRecipes, setLikedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikedRecipes = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(`/api/recipes/liked`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setLikedRecipes(response.data);
            } catch (error) {
                setError(error.message || '좋아요 한 레시피를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchLikedRecipes();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="myLikeRecipe-main">
            <PageHeader title="좋아요 레시피" />
            <div className="recipe-list">
                {likedRecipes.length > 0 ? (
                    likedRecipes.map(recipe => (
                        <div key={recipe.recipeIdx} className="recipe-list-item">
                            <RecipeCard recipe={recipe} />
                        </div>
                    ))
                ) : (
                    <div className="no-recipes-message">좋아요 한 레시피가 없습니다.</div>
                )}
            </div>
        </div>
    );
}

export default MyLikeRecipe;
