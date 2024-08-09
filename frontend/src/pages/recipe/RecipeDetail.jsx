import React, { useContext, useState, useEffect, useCallback } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RecipeComment from './RecipeComment';
import axios from "../../utils/axios";
import '../../assets/style/recipe/RecipeDetail.css';
import dayjs from 'dayjs'; // 날짜 포맷팅을 위한 라이브러리


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
        createComment
    } = useContext(RecipeContext);
    const [newComment, setNewComment] = useState('');
    const navigate = useNavigate();

    // 사용자 닉네임 가져오기
    const userNickname = localStorage.getItem('userNickname'); // 실제 구현에서는 백엔드에서 유저 정보를 가져와야 합니다.

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
                navigate('/recipe');
            } catch (error) {
                console.error('레시피 삭제 실패:', error);
                alert('레시피 삭제에 실패했습니다.');
            }
        }
    };

    // 재료와 조리 방법 분리 로직
    let ingredients = '';
    let instructions = '';
    if (selectedRecipe.content) {
        const ingredientsStart = selectedRecipe.content.indexOf('재료:');
        const instructionsStart = selectedRecipe.content.indexOf('만드는 법:');

        if (ingredientsStart !== -1 && instructionsStart !== -1) {
            ingredients = selectedRecipe.content.substring(ingredientsStart + 3, instructionsStart).trim(); // '재료:' 뒤부터 '만드는 법:' 전까지
            instructions = selectedRecipe.content.substring(instructionsStart + 6).trim(); // '만드는 법:' 뒤부터 끝까지
        } else if (ingredientsStart !== -1) {
            ingredients = selectedRecipe.content.substring(ingredientsStart + 3).trim(); // '재료:' 뒤부터 끝까지
        } else {
            instructions = selectedRecipe.content.trim(); // '재료:'나 '만드는 법:'이 없는 경우 전체 내용을 조리 방법으로 설정
        }
    }

    return (
        <div>
            {selectedRecipe && (
                <>
                    <h2>{selectedRecipe.title}</h2>
                    <div className="recipe-info">
                        <p>작성자: {selectedRecipe.nickname} </p>
                        <p>작성 시간: {dayjs(selectedRecipe.createdAt).format('YYYY-MM-DD HH:mm')} </p>
                        <p>조리 시간: {selectedRecipe.cookTime} 분 </p> {/* 조리 시간 추가 */}
                        <p>칼로리: {selectedRecipe.calories} kcal</p> {/* 칼로리 추가 */}
                    </div>
                    <img src={selectedRecipe.picture || '/images/default_recipe_image.jpg'} alt={selectedRecipe.title}
                         className="recipe-image"/>
                    <h3>재료:</h3>
                    <ul>
                        {ingredients.split(',').map((ingredient, index) => (
                            <li key={index}>{ingredient.trim()}</li>
                        ))}
                    </ul>

                    <h3>조리 방법:</h3>
                    <ul>
                        {instructions.split('.').map((instruction, index) => (
                            <li key={index}>{instruction.trim()}</li>
                        ))}
                    </ul>

                    {/* 좋아요 버튼 */}
                    <button className="like-button" onClick={handleLikeClick}>
                        {selectedRecipe.liked ? '좋아요 취소' : '좋아요'} ({selectedRecipe.likesCount})
                    </button>

                    {/* 수정 버튼 (작성자만 보이도록 조건 추가) */}
                    {userNickname === selectedRecipe.nickname && (
                        <Link to={`/recipe/edit/${recipeIdx}`}>
                            <button className="edit-button">수정</button>
                        </Link>
                    )}

                    {/* 삭제 버튼 (작성자만 보이도록 조건 추가) */}
                    {userNickname === selectedRecipe.nickname && (
                        <button className="delete-button" onClick={handleDeleteClick}>삭제</button>
                    )}

                    <div className="comment-section">
                        <h3>댓글</h3>
                        {selectedRecipe.comments && selectedRecipe.comments.map(comment => (
                            <RecipeComment key={comment.recipeCommentIdx} comment={comment} recipeId={recipeIdx} />
                        ))}
                        <div className="comment-input">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="댓글을 입력하세요"
                            />
                            <button onClick={handleCommentSubmit}>댓글 작성</button>
                        </div>
                    </div>
                </>
            )}

            {!selectedRecipe && loading && <div>Loading...</div>}
            {!selectedRecipe && !loading && <div>Recipe not found.</div>}
        </div>
    );
}

export default RecipeDetail;
