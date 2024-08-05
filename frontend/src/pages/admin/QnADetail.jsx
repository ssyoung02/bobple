import React from 'react';
import '../../assets/style/admin/QnADetail.css';

const QnADetail = ({ qna }) => {
    if (!qna) return null;

    return (
        <div className="qna-detail">
            <h3>문의 상세 정보</h3>
            <p><strong>번호:</strong> {qna.id}</p>
            <p><strong>작성자:</strong> {qna.name}</p>
            <p><strong>제목:</strong> {qna.title}</p>
            <p><strong>작성일자:</strong> {qna.date}</p>
            <p><strong>진행상황:</strong> {qna.status}</p>
            <p><strong>내용:</strong> 여기에 문의 내용이 들어갑니다.</p>
        </div>
    );
};

export default QnADetail;
