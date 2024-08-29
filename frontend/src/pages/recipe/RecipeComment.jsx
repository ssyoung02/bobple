import React, { useState, useContext, useEffect } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import '../../assets/style/recipe/RecipeComment.css';
import dayjs from 'dayjs';
import axios from '../../utils/axios';
import { MoreIcon } from "../../components/imgcomponents/ImgComponents";

/**
 * RecipeComment 컴포넌트
 * 레시피에 달린 댓글을 보여주고, 수정, 삭제, 신고 기능을 제공하는 컴포넌트
 * @param {Object} props - 댓글과 관련된 정보 (comment, recipeId)
 * @returns {JSX.Element} 댓글 UI 렌더링
 */
function RecipeComment({ comment, recipeId }) {
    const { updateComment, deleteComment } = useContext(RecipeContext); // 댓글 수정 및 삭제 함수를 불러옴
    const [isEditing, setIsEditing] = useState(false);  // 댓글 수정 모드 상태 관리
    const [editedContent, setEditedContent] = useState(comment.recipeContent); // 수정된 댓글 내용 상태 관리
    const [currentUserNickname, setCurrentUserNickname] = useState('');  // 현재 로그인한 사용자의 닉네임
    const [showActions, setShowActions] = useState(false); // 댓글 액션 버튼 표시 여부 상태 관리
    const [hasReported, setHasReported] = useState(false); // 댓글 신고 여부 상태 관리

    /**
     * 현재 로그인한 사용자의 정보를 불러오는 함수
     * 닉네임을 Principal에서 가져와서 설정
     */
    useEffect(() => {
        // 로그인한 사용자의 닉네임을 Principal에서 가져오기
        const fetchCurrentUserNickname = async () => {
            try {
                const response = await axios.get('/api/users/me'); // 현재 로그인한 유저 정보 API 호출
                setCurrentUserNickname(response.data.nickName); // 닉네임 설정
            } catch (error) {
                console.error('로그인한 사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
        fetchCurrentUserNickname();
    }, []);

    /**
     * 수정 버튼 클릭 시 수정 모드로 전환하는 함수
     */
    const handleEditClick = () => {
        setIsEditing(true); // 수정 모드 활성화
        setShowActions(false);  // 더보기 액션 숨김
    };

    /**
     * 수정 취소 버튼 클릭 시 수정 모드를 취소하는 함수
     * 수정 전 내용으로 복원하고 액션을 숨김
     */
    const handleEditCancel = () => {
        setIsEditing(false);  // 수정 모드 비활성화
        setEditedContent(comment.recipeContent);  // 기존 댓글 내용으로 복원
        setShowActions(false); // 더보기 액션 숨김
    };

    /**
     * 더보기 버튼 클릭 시 액션 메뉴 표시를 토글하는 함수
     */
    const toggleActions = () => {
        setShowActions(!showActions);  // 액션 메뉴 표시 상태 토글
    };

    /**
     * 댓글 수정 내용을 저장하는 함수
     * 수정된 내용을 서버에 보내고 수정 모드를 종료
     */
    const handleEditSubmit = async () => {
        try {
            await updateComment(recipeId, comment.recipeCommentIdx, editedContent);  // 댓글 수정 API 호출
            setIsEditing(false); // 수정 모드 비활성화
        } catch (error) {
            console.error('댓글 수정 실패:', error);
        }
    };

    /**
     * 댓글 삭제 버튼 클릭 시 호출되는 함수
     * 사용자에게 삭제 여부를 확인한 후 댓글을 삭제함
     */
    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('정말로 댓글을 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await deleteComment(recipeId, comment.recipeCommentIdx); // 댓글 삭제 API 호출
            } catch (error) {
                console.error('댓글 삭제 실패:', error);
            }
        }
    };

    /**
     * 댓글 신고 버튼 클릭 시 호출되는 함수
     * 해당 댓글 작성자를 신고 처리하고, 서버에 신고를 접수
     */
    const handleReportClick = async () => {
        try {
            await axios.post('/api/reports/user', {  // 신고 API 호출
                reporterUserNickname: currentUserNickname, // 신고자 닉네임
                reportedUserNickname: comment.nickname // 신고된 사용자 닉네임
            });
            alert('신고가 접수되었습니다.');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // 이미 신고된 유저일 경우 메시지를 표시
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
                        {currentUserNickname !== comment.nickname && (
                            <>
                        {!hasReported && <button onClick={handleReportClick}>신고</button>}
                            </>
                        )}
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
