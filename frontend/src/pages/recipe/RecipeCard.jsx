import React, {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import RecipeContext from '../../pages/recipe/RecipeContext';
import errorImage from '../../assets/images/error_image.jpg';
import '../../assets/style/recipe/RecipeCard.css';
import {Heart, HeartLine} from "../../components/imgcomponents/ImgComponents"; // CSS 파일 import

function RecipeCard({ recipe }) {
    const { likeRecipe,deleteRecipe } = useContext(RecipeContext);
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(recipe.liked);
    const [likesCount, setLikesCount] = useState(recipe.likesCount);

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
                </div>
            </Link>
            <div className="recipe-like">
                <button className="recipe-like-button" onClick={handleLikeClick}>
                    {isLiked ? <Heart /> : <HeartLine />}
                </button>
                {likesCount}
            </div>
            <Link to={`/recipe/${recipe.recipeIdx}`}>
            <div className="recipe-card-content">
                <h3>{recipe.title}</h3>
                <p className="author">작성자: {recipe.nickname}</p>
                <p className="description">
                    {recipe.content.length > 100 ? recipe.content.slice(0, 100) + "..." : recipe.content}
                </p>
            </div>
            </Link>
                <div className="recipe-card-actions">
                    {/* 수정 버튼 (작성자만 보이도록 조건 추가) */}
                    {localStorage.getItem('userIdx') == recipe.userIdx && (
                        <button className="edit-button" onClick={handleEditClick}>수정</button>
                    )}

                    {/* 삭제 버튼 (작성자만 보이도록 조건 추가) */}
                    {localStorage.getItem('userIdx') == recipe.userIdx && (
                        <button className="delete-button" onClick={handleDeleteClick}>삭제</button>
                    )}
                </div>

        </div>

    );
}

export default RecipeCard;