import React from 'react';
import '../../assets/style/recipe/UserRecommendedRecipeCard.css';
import { Link } from 'react-router-dom';
import errorImage from '../../assets/images/error_image.jpg';

function UserRecommendedRecipeCard({ recipe }) {
    return (
        <div>
        <Link to={`/recipe/${recipe.recipeIdx}`}>
        <div className="user-recommended-recipe-card">
            <div className="user-recommended-recipe-card-image">
                <img src={recipe.picture || '/images/default_recipe_image.jpg'} alt={recipe.title} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = errorImage;
                }}/>
                <div className="user-avatar">
                    <img src={recipe.profileImage || '/images/default_avatar.jpg'} alt={recipe.author} />
                </div>
            </div>
            <div className="user-recommended-recipe-card-content">
                <h4>{recipe.title}</h4>
                <p className="author">{recipe.nickname}</p>
                <p className="description">{recipe.description}</p>
                <div className={`like-button ${recipe.liked ? 'liked' : ''}`}>
                    <i className="heart-icon"></i>
                    <span>{recipe.likesCount}</span>
                </div>
            </div>
        </div>
        </Link>
        </div>
    );
}

export default UserRecommendedRecipeCard;
