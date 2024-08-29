import React, {useContext, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import RecipeContext from '../../pages/recipe/RecipeContext';
import '../../assets/style/recipe/RecipeCard.css';
import {Comment, Heart, HeartLine, MoreIcon} from "../../components/imgcomponents/ImgComponents"; // CSS 파일 import
import mascot from "../../assets/images/bobple_mascot.png";
import axios from "../../utils/axios"; // CSS 파일 import
import {formatViewsCount} from '../../utils/NumberFormatUtil'; // 조회수 포맷팅 함수 import

/**
 * RecipeCard 컴포넌트
 * 레시피 목록에 표시되는 각 레시피 카드 컴포넌트로, 좋아요, 삭제, 신고 등의 기능을 제공합니다.
 * @param {Object} props - 레시피 정보와 좋아요/삭제 이벤트 핸들러를 포함한 프로퍼티
 * @param {Object} props.recipe - 레시피 데이터 객체
 * @param {Function} props.onLike - 좋아요 클릭 시 호출되는 콜백 함수
 * @param {Function} props.onDelete - 레시피 삭제 후 호출되는 콜백 함수
 * @returns {JSX.Element} 레시피 카드 UI 렌더링
 */
function RecipeCard({recipe, onLike, onDelete}) {
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
    const [isLiked, setIsLiked] = useState(recipe.liked);  // 좋아요 상태 관리
    const [likesCount, setLikesCount] = useState(recipe.likesCount);   // 좋아요 수 상태 관리
    const [showActions, setShowActions] = useState(false);// 더보기 액션 표시 여부 관리

    /**
     * 좋아요 버튼 클릭 핸들러
     * 서버에 좋아요 요청을 보내고, 로컬 상태 업데이트
     */
    const handleLikeClick = async () => {
        try {
            // 서버에 좋아요 요청
            await axios.post(`/api/recipes/${recipe.recipeIdx}/like`);

            // 좋아요 상태와 좋아요 수 업데이트
            setIsLiked(!isLiked); // 좋아요 상태를 반전시킴
            setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1); // 좋아요 수 업데이트
            if (onLike) {
                onLike({...recipe, liked: !isLiked, likesCount: isLiked ? likesCount - 1 : likesCount + 1}); // 부모 컴포넌트로 상태 업데이트 전달
            }
        } catch (error) {
            console.error('좋아요 처리 중 오류가 발생했습니다.', error);
        }
    };

    /**
     * 삭제 버튼 클릭 핸들러
     * 사용자에게 확인 후 서버에 삭제 요청을 보냄
     */
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
                    pointComment: "레시피 삭제"
                }, {
                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                });

                console.log('Recipe deleted successfully');  // 성공 로그
                // 로컬 스토리지에서 관련 데이터를 지우는 함수가 있을 경우
                if (onDelete) {
                    onDelete(recipe.recipeIdx);  // 성공 시 콜백을 통한 상태 업데이트
                }

                // 로컬 스토리지에서 추천 레시피 삭제
                localStorage.removeItem('recommendedRecipes');
            } catch (error) {
                console.error('레시피 삭제 실패:', error);
                alert('레시피 삭제에 실패했습니다.');
            }
        } else {
            console.log("Recipe deletion was canceled by the user.");  // 취소된 경우 로그
        }
    };

    /**
     * 수정 버튼 클릭 핸들러
     * 레시피 수정 페이지로 이동
     */
    const handleEditClick = () => {
        navigate(`/recipe/modify/${recipe.recipeIdx}`);
    };

    /**
     * 더보기 버튼 클릭 핸들러
     * 더보기 액션 표시 상태를 토글
     */
    const toggleActions = () => {
        setShowActions(!showActions); // 액션 표시 상태 변경
    };

    /**
     * 신고 버튼 클릭 핸들러
     * 레시피 신고 요청을 서버에 보냄
     */
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
                    <img src={recipe.picture}
                         alt={recipe.title}
                         onError={(e) => {
                             e.target.onerror = null;
                             e.target.src = mascot;
                         }}
                    />
                </div>
                <div className="recipe-card-title">
                    <h4>{recipe.title}</h4>
                    <p className="author">작성자: {recipe.nickname} | 조회수: {formatViewsCount(recipe.viewsCount)}</p>
                </div>
            </Link>

            {/* 더보기 버튼 및 액션 표시 */}
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

                        {/* 신고 버튼 */}
                        {localStorage.getItem('userIdx') != recipe.userIdx && (
                        <button onClick={handleReportClick}>신고</button>
                        )}
                    </div>
                )}
            </div>
            <Link to={`/recipe/${recipe.recipeIdx}`}>
                <div className="recipe-card-content">
                    <p className="description">
                        {recipe.content.length > 100 ? recipe.content.slice(0, 100) + "..." : recipe.content} {/* 레시피 내용 길이 제한 */}
                    </p>
                </div>
            </Link>

            {/* 좋아요 및 댓글 버튼 */}
            <div className="recipe-card-bottom">
                <div className="recipe-card-bottom-button">
                    <button className="recipe-like-button" onClick={handleLikeClick}>
                        {isLiked ? <Heart/> : <HeartLine/>} {/* 좋아요 상태에 따라 다른 아이콘 표시 */}
                    </button>
                    {formatViewsCount(likesCount)}
                    {/* 좋아요 수 */}
                </div>
                <div className="recipe-card-bottom-button">
                    <Comment/>
                    {recipe.comments?.length || 0} {/* 댓글 수 */}
                </div>
            </div>
        </div>

    );
}

export default RecipeCard;