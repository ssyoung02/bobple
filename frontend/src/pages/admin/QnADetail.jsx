import React, { useState, useEffect } from 'react';
import '../../assets/style/admin/QnADetail.css';

const QnADetail = ({ qna }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentQna, setCurrentQna] = useState(qna);

    useEffect(() => {
        const fetchQnaDetail = async () => {
            if (qna) {
                try {
                    const response = await fetch(`http://localhost:8080/api/answers/${qna.queIdx}`);
                    if (response.ok) {
                        const textResponse = await response.text(); // 응답을 먼저 텍스트로 읽기
                        console.log('Response Text:', textResponse);
                        try {
                            const answers = JSON.parse(textResponse); // 텍스트를 JSON으로 파싱
                            const latestAnswer = answers.length > 0 ? answers[0] : null;
                            setCurrentQna(prevState => ({
                                ...prevState,
                                answer: latestAnswer ? latestAnswer.answer : '답변 예정'
                            }));
                        } catch (jsonError) {
                            console.error('JSON Parsing Error:', jsonError);
                        }
                    } else {
                        console.error('Failed to fetch answers');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        fetchQnaDetail();
    }, [qna]);

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
                // Refresh QnA details to include the newly added answer
                const updatedResponse = await fetch(`http://localhost:8080/api/answers/${qna.queIdx}`);
                if (updatedResponse.ok) {
                    const updatedAnswers = await updatedResponse.json();
                    const latestAnswer = updatedAnswers.length > 0 ? updatedAnswers[0] : null;
                    setCurrentQna(prevState => ({
                        ...prevState,
                        answer: latestAnswer ? latestAnswer.answer : '답변 예정'
                    }));
                }
            } else {
                console.error('Failed to save answer');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentQna) return null;

    return (
        <div className="qna-detail">
            <h3>문의 상세 정보</h3>
            <p><strong>번호:</strong> {currentQna.queIdx}</p>
            <p><strong>작성자:</strong> {currentQna.userName}</p>
            <p><strong>제목:</strong> {currentQna.queTitle}</p>
            <p><strong>작성일자:</strong> {new Date(currentQna.createdAt).toLocaleDateString()}</p>
            <p><strong>진행상황:</strong> {currentQna.status ? '완료' : '진행 중'}</p>
            <p><strong>내용:</strong> {currentQna.queDescription}</p>

            <p><strong>답변:</strong> {currentQna.answer}</p>

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
