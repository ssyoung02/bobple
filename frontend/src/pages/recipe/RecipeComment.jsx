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
    const [hasReported, setHasReported] = useState(false); // 이미 신고했는지 여부를 확인하는 상태

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
            await axios.post('/api/reports/user', {
                reporterUserNickname: currentUserNickname,
                reportedUserNickname: comment.nickname
            });
            alert('신고가 접수되었습니다.');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // 이미 신고된 유저일 경우 메시지를 표시
                alert('이미 이 유저를 신고하셨습니다.');
            } else if (error.response) {
                // 다른 서버 오류에 대한 처리 (필요시 추가적인 오류 처리 가능)
                console.error('서버 오류:', error.response.data);
            } else if (error.request) {
                // 요청이 전송되었지만 응답을 받지 못했을 때
                console.error('네트워크 오류:', error.request);
            } else {
                // 기타 예상치 못한 오류에 대한 처리
                console.error('신고 처리 중 알 수 없는 오류 발생:', error.message);
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
                    <span className="comment-nickname">{comment.nickname}</span>
                    <span className="created-at">{dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <button className="comment-more" aria-label="더보기" onClick={toggleActions}>
                    <MoreIcon />
                </button>
                {showActions && (
                    <div className="comment-actions">
                        {!hasReported && <button onClick={handleReportClick}>신고</button>}
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
