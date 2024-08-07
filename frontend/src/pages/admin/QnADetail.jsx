import React from 'react';
import '../../assets/style/admin/QnADetail.css';

const QnADetail = ({ qna }) => {
    if (!qna) return null;

    return (
        <div className="qna-detail">
            <div className="qna-detail-header">
                <p> {qna.title}</p>
                <hr/>
            </div>

            <span>여기에 문의 내용이 들어갑니다.</span>

            <div className="qna-message-input">
                <input
                    type="text"
                    placeholder="메시지를 입력하세요"
                />
                <button>전송</button>
            </div>
        </div>
    );
};

export default QnADetail;
