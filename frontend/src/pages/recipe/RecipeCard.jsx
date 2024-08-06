import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import RecipeContext from '../../pages/recipe/RecipeContext';
import errorImage from '../../assets/images/error_image.jpg';
import '../../assets/style/recipe/RecipeCard.css'; // CSS 파일 import

function RecipeCard({ recipe }) {
    const { likeRecipe } = useContext(RecipeContext);

    const handleLikeClick = () => {
        likeRecipe(recipe.recipeIdx);
    };

    return (
        <div className="recipe-card">
            <Link to={`/recipe/${recipe.recipeIdx}`}>
                <div className="recipe-card-image">
                    <img src={recipe.picture || '/images/default_recipe_image.jpg'}
                         alt={recipe.title}
                         onError={(e) => {
                             e.target.onerror = null;
                             e.target.src = errorImage;
                         }}
                    />
                    <div className={`like-button ${recipe.liked ? 'liked' : ''}`} onClick={handleLikeClick}>
                        <i className="heart-icon"></i> {/* CSS 클래스 이름 변경 */}
                        <span>{recipe.likesCount}</span>
                    </div>
                </div>
                <div className="recipe-card-content">
                    <h3>{recipe.title}</h3>
                    <p className="author">작성자: {recipe.nickname}</p>
                    <p className="description">
                        {recipe.content.length > 100 ? recipe.content.slice(0, 100) + "..." : recipe.content}
                    </p>
                </div>
            </Link>
        </div>
    );
}

export default RecipeCard;