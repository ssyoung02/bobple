import React, { useContext, useState, useEffect, useCallback } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import RecipeComment from './RecipeComment';
import axios from "../../utils/axios";
import '../../assets/style/recipe/RecipeDetail.css';
import dayjs from 'dayjs';
import mascot from "../../assets/images/bobple_mascot.png";

import {
    Calendar,
    ClockIcon,
    DefaultUser,
    FireIcon,
    Heart,
    HeartLine, MoreIcon, SendMessage, View
} from "../../components/imgcomponents/ImgComponents";
import PageHeader from "../../components/layout/PageHeader";
import {useOnlyHeaderColorChange} from "../../hooks/NavigateComponentHooks";
import {clearRecipeLocalStorage} from "../../utils/localStorageUtils";

function RecipeDetail() {
    const { recipeIdx } = useParams();
    const {
        getRecipeById,
        selectedRecipe,
        loading,
        error,
        deleteRecipe,
        setSelectedRecipe,
        setError,
        createComment,
        formatViewsCount
    } = useContext(RecipeContext);
    const [newComment, setNewComment] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [showActions, setShowActions] = useState(false); // 상태 추가

    useOnlyHeaderColorChange(location.pathname, 'transparent');

    const fetchRecipeAndComments = useCallback(async () => {
        try {
            await getRecipeById(recipeIdx);
            const response = await axios.get(`/api/recipes/${recipeIdx}/comments`);
            setSelectedRecipe(prevRecipe => ({
                ...prevRecipe,
                comments: response.data
            }));
            // Increment views count
            await axios.post(`/api/recipes/${recipeIdx}/increment-views`);
        } catch (error) {
            setError(error.message || '데이터를 불러오는 중 오류가 발생했습니다.');
        }
    }, [recipeIdx, getRecipeById, setError, setSelectedRecipe]);

    useEffect(() => {
        fetchRecipeAndComments();
    }, [fetchRecipeAndComments]);

    const handleCommentSubmit = async () => {
        try {
            await createComment(recipeIdx, newComment);
            setNewComment('');
            const response = await axios.get(`/api/recipes/${recipeIdx}/comments`);
            setSelectedRecipe(prevRecipe => ({
                ...prevRecipe,
                comments: response.data
            }));
        } catch (error) {
            setError(error.message || '댓글 작성 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!selectedRecipe) return (
        <div className="recipe-detail-container">
            <h2>레시피 상세</h2>
            <div className="recipe-not-found">
                레시피를 찾을 수 없습니다.
            </div>
        </div>
    );

    const handleLikeClick = async () => {
        try {
            await axios.post(`/api/recipes/${recipeIdx}/like`); // 사용자 ID를 요청에 포함하지 않음

            // 좋아요 상태와 좋아요 수 업데이트
            setSelectedRecipe(prevRecipe => ({
                ...prevRecipe,
                liked: !prevRecipe.liked,
                likesCount: prevRecipe.liked ? prevRecipe.likesCount - 1 : prevRecipe.likesCount + 1
            }));
        } catch (error) {
            setError(error.message || '좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('정말로 레시피를 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await deleteRecipe(recipeIdx);
                // 레시피 삭제시 포인트 차감 요청
                await axios.post("/api/point/result/update", {
                    userIdx: Number(localStorage.getItem('userIdx')),
                    point: -1, // 포인트 차감
                    pointComment: "레시피 삭제"}, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                clearRecipeLocalStorage();
                navigate('/recipe');
                window.location.reload(); // 새로고침

            } catch (error) {
                console.error('레시피 삭제 실패:', error);
                alert('레시피 삭제에 실패했습니다.');
            }
        }
    };

    const handleEditClick = () => {
        navigate(`/recipe/modify/${recipeIdx}`);
    };

    // 재료와 조리 방법 분리 로직
    let ingredients = '';
    let instructions = '';

    if (selectedRecipe.content) {
        // "만드는 법:"을 기준으로 분리
        const instructionsStart = selectedRecipe.content.indexOf('만드는 법:');

        if (instructionsStart !== -1) {
            // "만드는 법:" 앞부분은 재료
            ingredients = selectedRecipe.content.substring(0, instructionsStart).trim();
            // "만드는 법:" 뒷부분은 조리 방법
            instructions = selectedRecipe.content.substring(instructionsStart + 6).trim();
        } else {
            // "만드는 법:"이 없는 경우 전체 내용을 재료로 간주
            ingredients = selectedRecipe.content.trim();
        }
    }

    const toggleActions = () => {
        setShowActions(!showActions); // showActions 상태를 토글
    };

    const handleReportClick = async () => {
        const confirmReport = window.confirm('정말로 이 레시피를 신고하시겠습니까?');
        if (confirmReport) {
            try {
                // 신고 API 호출
                await axios.post(`/api/recipes/${recipeIdx}/report`);
                alert('신고가 접수되었습니다.');
            } catch (error) {
                console.error('신고 중 오류가 발생했습니다:', error);
                alert('신고 처리 중 오류가 발생했습니다.');
            }
        }
    };


    return (
        <div className="recipe-detail-main">
            <PageHeader title="" />
            <div className="recipe-detail-user-action ">
                <button className="recipe-detail-like" onClick={handleLikeClick}>
                    {selectedRecipe.liked ?
                        <>
                            <Heart/>
                            {formatViewsCount(selectedRecipe.likesCount)}
                        </>
                        :
                        <>
                            <HeartLine/>
                            {formatViewsCount(selectedRecipe.likesCount)}
                        </>
                    }
                </button>
                <button className="user-action-more" aria-label="더보기" onClick={toggleActions}>
                    <MoreIcon/>
                </button>
                {showActions && (
                    <div className="recipe-declaration">
                        <button onClick={handleReportClick}>신고</button>
                    </div>
                )}
            </div>
            {selectedRecipe && (
                <>
                    <div className="recipe-detail-header">
                        <img src={selectedRecipe.picture || '/bobple_mascot.png'} alt={selectedRecipe.title}onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = mascot;
                        }}
                             className="recipe-detail-image"/>
                    </div>
                    <div className="recipe-detail-title-box">
                        <div className="recipe-detail-title-item">
                            <h2>{selectedRecipe.title}</h2>
                        </div>
                        <div className="recipe-detail-title-item">
                            <div className="recipe-detail-title-text">
                                <DefaultUser />
                                <p>{selectedRecipe.nickname} </p>
                            </div>
                            <div className="recipe-detail-title-text">
                                <Calendar />
                                <p> {dayjs(selectedRecipe.createdAt).format('YYYY-MM-DD')} </p>
                            </div>
                            <div className="recipe-detail-title-text">
                                <View />
                                <p>{formatViewsCount(selectedRecipe.viewsCount)} 회</p>
                            </div>
                        </div>
                        <div className="recipe-detail-title-item">
                            <div className="recipe-detail-title-text recipe-sub-title">
                                <ClockIcon />
                                <p>{selectedRecipe.cookTime} 분 </p>
                            </div>
                            <div className="recipe-detail-title-text recipe-sub-title">
                                <FireIcon />
                                <p>{selectedRecipe.calories} kcal</p>
                            </div>
                        </div>
                    </div>

                    <div className="recipe-detail-content">
                        <h4>재료</h4>
                        <ul>
                            {ingredients.split(',').map((ingredient, index) => (
                                <li key={index}>{ingredient.trim()}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="recipe-detail-content">
                        <h4>조리 방법</h4>
                        <ul>
                            {instructions.split('.').map((instruction, index) => (
                                <li key={index}>{instruction.trim()}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="recipe-detail-content-buttons">
                        {localStorage.getItem('userIdx') == selectedRecipe.userIdx && (
                            <button className="delete-button" onClick={handleDeleteClick}>삭제</button>
                        )}
                        {localStorage.getItem('userIdx') == selectedRecipe.userIdx && (
                            <button className="edit-button" onClick={handleEditClick}>수정</button>
                        )}
                    </div>

                    <div className="comment-section">
                        <h5>댓글 ({selectedRecipe.comments?.length || 0})</h5>
                        <div className="comment-input">
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="댓글을 입력하세요"
                            />
                            <button onClick={handleCommentSubmit} className="comment-send-button"><SendMessage />
                            </button>
                        </div>
                        {selectedRecipe.comments && selectedRecipe.comments.map(comment => (
                            <RecipeComment key={comment.recipeCommentIdx} comment={comment} recipeId={recipeIdx} />
                        ))}
                    </div>

                </>
            )}

            {!selectedRecipe && loading && <div>Loading...</div>}
            {!selectedRecipe && !loading && <div>Recipe not found.</div>}
        </div>
    );
}

export default RecipeDetail;
