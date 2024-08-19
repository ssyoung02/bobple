import React, {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import RecipeContext from '../../pages/recipe/RecipeContext';
import '../../assets/style/recipe/RecipeCard.css';
import {Comment, Heart, HeartLine, MoreIcon} from "../../components/imgcomponents/ImgComponents"; // CSS 파일 import
import mascot from "../../assets/images/bobple_mascot.png";
import axios from "../../utils/axios"; // CSS 파일 import
import { formatViewsCount } from '../../utils/NumberFormatUtil'; // 함수 import


function RecipeCard({ recipe, onLike, onDelete  }) {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(recipe.liked);
    const [likesCount, setLikesCount] = useState(recipe.likesCount);
    const [showActions, setShowActions] = useState(false); // 상태 추가

    const handleLikeClick = async () => {
        try {
            await axios.post(`/api/recipes/${recipe.recipeIdx}/like`);

            // 좋아요 상태와 좋아요 수 업데이트
            setIsLiked(!isLiked);
            setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
            onLike({ ...recipe, liked: !isLiked, likesCount: isLiked ? likesCount - 1 : likesCount + 1 });
        } catch (error) {
            console.error('좋아요 처리 중 오류가 발생했습니다.', error);
        }
    };


    const handleDeleteClick = async () => {
        console.log("Delete button clicked");  // 클릭 이벤트가 제대로 발생하는지 확인
        const confirmDelete = window.confirm('정말로 레시피를 삭제하시겠습니까?');
        console.log("User confirmed deletion:", confirmDelete);  // confirm의 반환값을 확인

        if (confirmDelete) {
            try {
                console.log(`Attempting to delete recipe with ID: ${recipe.recipeIdx}`);  // 로그 추가
                const token = localStorage.getItem('token');
                await axios.delete(`/api/recipes/${recipe.recipeIdx}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // 레시피 삭제시 포인트 차감 요청
                await axios.post("/api/point/result/update", {
                    userIdx: Number(localStorage.getItem('userIdx')),
                    point: -1, // 포인트 차감
                    pointComment: "레시피 삭제"}, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                console.log('Recipe deleted successfully');  // 성공 로그
                // 로컬 스토리지에서 관련 데이터를 지우는 함수가 있을 경우
                if (onDelete) {
                    onDelete(recipe.recipeIdx);  // 성공 시 콜백을 통한 상태 업데이트
                }

                // 페이지를 강제로 새로고침하지 않고, 상태를 업데이트하여 UI를 반영합니다.
                localStorage.removeItem('recommendedRecipes');
            } catch (error) {
                console.error('레시피 삭제 실패:', error);
                alert('레시피 삭제에 실패했습니다.');
            }
        }else {
            console.log("Recipe deletion was canceled by the user.");  // 취소된 경우 로그
        }
    };

    const handleEditClick = () => {
        navigate(`/recipe/modify/${recipe.recipeIdx}`);
    };

    const toggleActions = () => {
        setShowActions(!showActions); // showActions 상태를 토글
    };

    const handleReportClick = async () => {
        const confirmReport = window.confirm('정말로 이 레시피를 신고하시겠습니까?');
        if (confirmReport) {
            try {
                // 신고 API 호출
                await axios.post(`/api/recipes/${recipe.recipeIdx}/report`);
                alert('신고가 접수되었습니다.');
            } catch (error) {
                console.error('신고 중 오류가 발생했습니다:', error);
                alert('신고 처리 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="recipe-card">
            <Link to={`/recipe/${recipe.recipeIdx}`}>
                <div className="recipe-card-image">
                    <img src={recipe.picture }
                         alt={recipe.title}
                         onError={(e) => {
                             e.target.onerror = null;
                             e.target.src = mascot;
                         }}
                    />
                </div>
                <div className="recipe-card-title">
                    <h4>{recipe.title}</h4>
                    <p className="author">작성자: {recipe.nickname} | 조회수:  {formatViewsCount(recipe.viewsCount)}</p>
                </div>
            </Link>
            <div className="recipe-user-action-more">
                <button className="user-action-more" aria-label="더보기" onClick={toggleActions}>
                    <MoreIcon/>
                </button>
                {showActions && (
                    <div className="recipe-card-actions">
                        {/* 수정 버튼 (작성자만 보이도록 조건 추가) */}
                        {localStorage.getItem('userIdx') == recipe.userIdx && (
                            <button className="edit-button" onClick={handleEditClick}>수정</button>
                        )}

                        {/* 삭제 버튼 (작성자만 보이도록 조건 추가) */}
                        {localStorage.getItem('userIdx') == recipe.userIdx && (
                            <button className="delete-button" onClick={handleDeleteClick}>삭제</button>
                        )}

                        <button onClick={handleReportClick}>신고</button>
                    </div>
                    )}
            </div>
            <Link to={`/recipe/${recipe.recipeIdx}`}>
                <div className="recipe-card-content">
                    <p className="description">
                        {recipe.content.length > 100 ? recipe.content.slice(0, 100) + "..." : recipe.content}
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
                <div className="recipe-card-bottom-button">
                    <Comment/>
                    {recipe.comments?.length || 0}
                </div>
            </div>
        </div>

    );
}

export default RecipeCard;