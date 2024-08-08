import React, { useState, useContext } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import '../../assets/style/recipe/RecipeComment.css';
import dayjs from 'dayjs'; // 날짜 포맷팅을 위한 라이브러리

function RecipeComment({ comment , recipeId }) {
    const { updateComment, deleteComment } = useContext(RecipeContext);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.recipeContent);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setEditedContent(comment.recipeContent); // 원래 내용으로 복원
    };

    const handleEditSubmit = async () => {
        try {
            await updateComment(recipeId, comment.recipeCommentIdx, editedContent);// recipeId 전달
            setIsEditing(false);
        } catch (error) {
            console.error('댓글 수정 실패:', error);
        }
    };

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('정말로 댓글을 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await deleteComment(recipeId, comment.recipeCommentIdx);// recipeId 전달
            } catch (error) {
                console.error('댓글 삭제 실패:', error);
            }
        }
    };

    return (
        <div className="comment">
            <div className="comment-header">
                <div className="avatar">
                    <img src={comment.profileImage || "/images/avatar/small/matt.jpg"} alt="사용자 프로필 이미지" />
                </div>
                <div className="comment-info">
                    <span className="nickname">{comment.nickname}</span>
                    <span className="created-at">{dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <div className="comment-actions">
                    {!isEditing && (
                        <>
                            <button onClick={handleEditClick}>수정</button>
                            <button onClick={handleDeleteClick}>삭제</button>
                        </>
                    )}
                </div>
            </div>

            <div className="comment-content">
                {isEditing ? (
                    <div>
                        <textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} />
                        <button onClick={handleEditSubmit}>수정 완료</button>
                        <button onClick={handleEditCancel}>취소</button>
                    </div>
                ) : (
                    <p>{comment.recipeContent}</p>
                )}
            </div>
        </div>
    );
}

export default RecipeComment;
