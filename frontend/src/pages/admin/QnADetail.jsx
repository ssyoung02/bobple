import React, { useState } from 'react';
import '../../assets/style/admin/QnADetail.css';

const QnADetail = ({ qna }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!qna) return null;

    const handleSend = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionId: qna.queIdx,
                    answer: message,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Answer saved:', result);
                // Optionally, you can update the UI or state here
            } else {
                console.error('Failed to save answer');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="qna-detail">
            <h3>문의 상세 정보</h3>
            <p><strong>번호:</strong> {qna.queIdx}</p>
            <p><strong>작성자:</strong> {qna.userName}</p>
            <p><strong>제목:</strong> {qna.queTitle}</p>
            <p><strong>작성일자:</strong> {new Date(qna.createdAt).toLocaleDateString()}</p>
            <p><strong>진행상황:</strong> {qna.status ? '완료' : '진행 중'}</p>
            <p><strong>내용:</strong> {qna.queDescription}</p>

            <div className="qna-message-input">
                <input
                    type="text"
                    placeholder="메시지를 입력하세요"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSend} disabled={loading}>
                    {loading ? '전송 중...' : '전송'}
                </button>
            </div>
        </div>
    );
};

export default QnADetail;
