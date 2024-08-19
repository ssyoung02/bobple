import React, {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import RecipeContext from '../../pages/recipe/RecipeContext';
import errorImage from '../../assets/images/error_image.jpg';
import '../../assets/style/recipe/RecipeCard.css';
import {Comment, Heart, HeartLine, MoreIcon} from "../../components/imgcomponents/ImgComponents"; // CSS 파일 import
import mascot from "../../assets/images/bobple_mascot.png"; // CSS 파일 import


function RecipeCard({ recipe }) {
    const { likeRecipe,deleteRecipe,formatViewsCount } = useContext(RecipeContext);
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(recipe.liked);
    const [likesCount, setLikesCount] = useState(recipe.likesCount);
    const [showActions, setShowActions] = useState(false); // 상태 추가

    const handleLikeClick = async () => {
        try {
            await likeRecipe(recipe.recipeIdx);
            setIsLiked(!isLiked);
            setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);

        } catch (error) {
            console.error('좋아요 처리 중 오류가 발생했습니다.', error);
        }
    };

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('정말로 레시피를 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await deleteRecipe(recipe.recipeIdx);
                localStorage.removeItem('recommendedRecipes');
                window.location.reload(); // 페이지를 새로고침하여 변경사항 반영
            } catch (error) {
                console.error('레시피 삭제 실패:', error);
                alert('레시피 삭제에 실패했습니다.');
            }
        }
    };

    const handleEditClick = () => {
        navigate(`/recipe/modify/${recipe.recipeIdx}`);
    };

    const toggleActions = () => {
        setShowActions(!showActions); // showActions 상태를 토글
    };

    return (
        <div className="main-recipe-card">
            <Link to={`/recipe/${recipe.recipeIdx}`}>
                <div className="recipe-card-image">
                    <img src={recipe.picture}
                         alt={recipe.title}
                         onError={(e) => {
                             e.target.onerror = null;
                             e.target.src = mascot;
                         }}
                    />
                </div>
            </Link>
            <Link to={`/recipe/${recipe.recipeIdx}`} className="main-recipe-card-title">
                <div>
                    <h5>{recipe.title}</h5>
                    <p className="author">작성자: {recipe.nickname} | 조회수: {recipe.viewsCount} </p>
                    <p className="description">
                        {recipe.content.length > 50 ? recipe.content.slice(0, 20) + "..." : recipe.content}
                    </p>
                </div>
            </Link>
            <div className="recipe-card-bottom">
                <div className="recipe-card-bottom-button">
                    <button className="recipe-like-button" onClick={handleLikeClick}>
                        {isLiked ? <Heart/> : <HeartLine/>}
                    </button>
                    {likesCount}
                </div>
            </div>

        </div>

    );
}

export default RecipeCard;