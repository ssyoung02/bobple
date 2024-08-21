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
import {ClipLoader} from "react-spinners";

/**
 * RecipeDetail 컴포넌트
 * 특정 레시피의 상세 정보를 보여주는 컴포넌트로, 레시피 정보, 재료, 조리법, 좋아요, 댓글 기능이 포함됨
 * @returns {JSX.Element} 레시피 상세 정보 화면 렌더링
 */
function RecipeDetail() {
    const { recipeIdx } = useParams(); // URL에서 recipeIdx 추출
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
    } = useContext(RecipeContext); // RecipeContext에서 필요한 상태 및 함수들 불러오기
    const [newComment, setNewComment] = useState(''); // 새로운 댓글 입력 상태 관리
    const navigate = useNavigate(); // 페이지 이동 훅
    const location = useLocation();  // 현재 경로 정보 추출
    const [showActions, setShowActions] = useState(false); // 더보기 액션 메뉴 표시 여부

    useOnlyHeaderColorChange(location.pathname, 'transparent'); // 헤더 색상 변경을 위한 커스텀 훅 사용

    /**
     * 레시피 및 댓글 데이터를 서버에서 가져오는 함수
     * 레시피 정보와 댓글 목록을 불러오고, 조회수를 증가시킴
     */
    const fetchRecipeAndComments = useCallback(async () => {
        try {
            await getRecipeById(recipeIdx);  // 레시피 정보 불러오기
            const response = await axios.get(`/api/recipes/${recipeIdx}/comments`);  // 댓글 정보 불러오기
            setSelectedRecipe(prevRecipe => ({
                ...prevRecipe,
                comments: response.data // 불러온 댓글을 레시피 상태에 저장
            }));
            // 조회수 증가 API 호출
            await axios.post(`/api/recipes/${recipeIdx}/increment-views`);
        } catch (error) {
            setError(error.message || '데이터를 불러오는 중 오류가 발생했습니다.');
        }
    }, [recipeIdx, getRecipeById, setError, setSelectedRecipe]);

    // 컴포넌트가 마운트될 때 레시피 및 댓글 데이터를 불러옴
    useEffect(() => {
        fetchRecipeAndComments();
    }, [fetchRecipeAndComments]);

    /**
     * 새로운 댓글을 작성하는 함수
     * 댓글 작성 후 새롭게 댓글 목록을 불러옴
     */
    const handleCommentSubmit = async () => {
        try {
            await createComment(recipeIdx, newComment); // 새로운 댓글 생성
            setNewComment(''); // 입력 필드 초기화
            const response = await axios.get(`/api/recipes/${recipeIdx}/comments`); // 댓글 목록 다시 불러오기
            setSelectedRecipe(prevRecipe => ({
                ...prevRecipe,
                comments: response.data  // 새 댓글 목록으로 업데이트
            }));
        } catch (error) {
            setError(error.message || '댓글 작성 중 오류가 발생했습니다.');
        }
    };
    // 로딩 중일 때 로딩 메시지를 표시하고, 에러 발생 시 에러 메시지를 표시함
    if (loading) return <div className="loading-spinner">
        <ClipLoader size={50} color={"#123abc"} />
    </div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!selectedRecipe) return (
        <div className="recipe-detail-container">
        <h2>레시피 상세</h2>
            <div className="recipe-not-found">
                레시피를 찾을 수 없습니다.
            </div>
        </div>
    );

    /**
     * 좋아요 버튼 클릭 시 호출되는 함수
     * 레시피에 대한 좋아요 상태를 토글하고, 좋아요 수를 업데이트함
     */
    const handleLikeClick = async () => {
        try {
            await axios.post(`/api/recipes/${recipeIdx}/like`);  // 좋아요 API 호출

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

    /**
     * 레시피 삭제 버튼 클릭 시 호출되는 함수
     * 사용자가 삭제를 확인하면 레시피를 삭제하고 포인트를 차감한 후 목록 페이지로 이동
     */
    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('정말로 레시피를 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await deleteRecipe(recipeIdx); // 레시피 삭제
                // 레시피 삭제시 포인트 차감 요청
                await axios.post("/api/point/result/update", {
                    userIdx: Number(localStorage.getItem('userIdx')),
                    point: -1, // 포인트 차감
                    pointComment: "레시피 삭제"}, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                clearRecipeLocalStorage();  // 로컬 스토리지에서 레시피 관련 데이터 삭제
                navigate('/recipe');  // 레시피 목록 페이지로 이동
                window.location.reload(); // 새로고침

            } catch (error) {
                console.error('레시피 삭제 실패:', error);
                alert('레시피 삭제에 실패했습니다.');
            }
        }
    };

    /**
     * 레시피 수정 버튼 클릭 시 호출되는 함수
     * 수정 페이지로 이동함
     */
    const handleEditClick = () => {
        navigate(`/recipe/modify/${recipeIdx}`); // 레시피 수정 페이지로 이동
    };

    // 레시피 내용을 재료와 조리 방법으로 분리하는 로직
    let ingredients = '';
    let instructions = '';

    if (selectedRecipe.content) {
        // "만드는 법:"을 기준으로 분리
        const instructionsStart = selectedRecipe.content.indexOf('만드는 법:'); // "만드는 법:"을 기준으로 분리

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

    // 재료와 조리 방법을 split 할 때, 해당 변수가 null 또는 빈 문자열이 아닌지 확인
    const ingredientList = ingredients ? ingredients.split(',,').map(ingredient => ingredient.trim()) : [];
    const instructionList = instructions ? instructions.split('..').map(instruction => instruction.trim()) : [];

    const toggleActions = () => {
        setShowActions(!showActions);     // 더보기 액션 메뉴를 토글하는 함수
    };

    /**
     * 레시피 신고 버튼 클릭 시 호출되는 함수
     * 사용자에게 신고를 확인하고, 신고를 처리
     */
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
            {selectedRecipe && (
                <>
                    <div className="recipe-detail-header">
                        <img src={selectedRecipe.picture || '/bobple_mascot.png'} alt={selectedRecipe.title}
                             onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = mascot;
                             }}
                             className="recipe-detail-image"/>
                    </div>
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
                    <div className="recipe-detail-title-box">
                        <div className="recipe-detail-title-item">
                            <h2>{selectedRecipe.title}</h2>
                        </div>
                        <div className="recipe-detail-title-item">
                            <div className="recipe-detail-title-text">
                                <DefaultUser/>
                                <p>{selectedRecipe.nickname} </p>
                            </div>
                            <div className="recipe-detail-title-text">
                                <Calendar/>
                                <p> {dayjs(selectedRecipe.createdAt).format('YYYY-MM-DD')} </p>
                            </div>
                            <div className="recipe-detail-title-text">
                                <View/>
                                <p>{formatViewsCount(selectedRecipe.viewsCount)} 회</p>
                            </div>
                        </div>
                        <div className="recipe-detail-title-item">
                            <div className="recipe-detail-title-text recipe-sub-title">
                                <ClockIcon/>
                                <p>{selectedRecipe.cookTime} 분 </p>
                            </div>
                            <div className="recipe-detail-title-text recipe-sub-title">
                                <FireIcon/>
                                <p>{selectedRecipe.calories} kcal</p>
                            </div>
                        </div>
                    </div>

                    <div className="recipe-detail-content">
                        <h4>재료</h4>
                        <ul className="recipe-detail-ul">
                            {ingredientList.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="recipe-detail-content">
                        <h4>조리 방법</h4>
                        <ul>
                            {instructions.split(/(?=\d+\.)/).map((instruction, index) => (
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
                            <button onClick={handleCommentSubmit} className="comment-send-button"><SendMessage/>
                            </button>
                        </div>
                        {selectedRecipe.comments && selectedRecipe.comments.map(comment => (
                            <RecipeComment key={comment.recipeCommentIdx} comment={comment} recipeId={recipeIdx}/>
                        ))}
                    </div>

                </>
            )}

            {!selectedRecipe && loading && (
                <div className="loading-spinner slider">
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                </div>
            )}
            {!selectedRecipe && !loading && <div>Recipe not found.</div>}
        </div>
    );
}

export default RecipeDetail;
