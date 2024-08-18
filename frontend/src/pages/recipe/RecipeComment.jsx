import React, { useState, useContext, useEffect } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import '../../assets/style/recipe/RecipeComment.css';
import dayjs from 'dayjs';
import axios from '../../utils/axios';
import { MoreIcon } from "../../components/imgcomponents/ImgComponents";

function RecipeComment({ comment, recipeId }) {
    const { updateComment, deleteComment } = useContext(RecipeContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.recipeContent);
    const [currentUserNickname, setCurrentUserNickname] = useState('');
    const [showActions, setShowActions] = useState(false);

    useEffect(() => {
        // 로그인한 사용자의 닉네임을 Principal에서 가져오기
        const fetchCurrentUserNickname = async () => {
            try {
                const response = await axios.get('/api/users/me');
                setCurrentUserNickname(response.data.nickName);
            } catch (error) {
                console.error('로그인한 사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
        fetchCurrentUserNickname();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
        setShowActions(false);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditedContent(comment.recipeContent);
        setShowActions(false);
    };

    const toggleActions = () => {
        setShowActions(!showActions);
    };

    const handleEditSubmit = async () => {
        try {
            await updateComment(recipeId, comment.recipeCommentIdx, editedContent);
            setIsEditing(false);
        } catch (error) {
            console.error('댓글 수정 실패:', error);
        }
    };

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('정말로 댓글을 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await deleteComment(recipeId, comment.recipeCommentIdx);
            } catch (error) {
                console.error('댓글 삭제 실패:', error);
            }
        }
    };

    const handleReportClick = async () => {
        try {
            await axios.post(`/api/comments/${comment.recipeCommentIdx}/report`, { nickname: comment.nickname });
            alert('신고가 접수되었습니다.');
        } catch (error) {
            console.error('신고 실패:', error);
            alert('신고를 처리하는 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="comment">
            <div className="comment-header">
                <div className="avatar">
                    <img src={comment.profileImage || "/images/avatar/small/matt.jpg"} alt="사용자 프로필 이미지" />
                </div>
                <div className="comment-info">
                    <span className="comment-nickname">{comment.nickname}</span>
                    <span className="created-at">{dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <button className="comment-more" aria-label="더보기" onClick={toggleActions}>
                    <MoreIcon />
                </button>
                {showActions && (
                    <div className="comment-actions">
                        <button onClick={handleReportClick}>신고</button>
                        {currentUserNickname === comment.nickname && (
                            <>
                                {!isEditing && (
                                    <>
                                        <button onClick={handleEditClick}>수정</button>
                                        <button onClick={handleDeleteClick}>삭제</button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="comment-content">
                {isEditing ? (
                    <>
                        <textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} />
                        <div className="comment-content-buttons">
                            <button onClick={handleEditCancel}>취소</button>
                            <button className="edit-button" onClick={handleEditSubmit}>등록</button>
                        </div>
                    </>
                ) : (
                    <p>{comment.recipeContent}</p>
                )}
            </div>
        </div>
    );
}

export default RecipeComment;
