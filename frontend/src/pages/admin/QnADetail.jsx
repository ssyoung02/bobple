import React from 'react';
import '../../assets/style/admin/QnADetail.css';

const QnADetail = ({ qna }) => {
    if (!qna) return null;

    return (
        <div className="qna-detail">
            <h3>문의 상세 정보</h3>
            <p><strong>번호:</strong> {qna.queIdx}</p>
            <p><strong>작성자:</strong> {qna.userName}</p>
            <p><strong>제목:</strong> {qna.queTitle}</p>
            <p><strong>작성일자:</strong> {new Date(qna.createdAt).toLocaleDateString()}</p>
            <p><strong>진행상황:</strong> {qna.status ? '완료' : '진행 중'}</p>
            <p><strong>내용:</strong> {qna.queDescription}</p>
        </div>
    );
};

export default QnADetail;
