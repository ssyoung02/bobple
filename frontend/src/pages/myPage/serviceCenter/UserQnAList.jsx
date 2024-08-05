    import React, { useEffect, useState } from 'react';
    import axios from 'axios';

    function UserQnAList() {
        const [questions, setQuestions] = useState([]);
        const [loading, setLoading] = useState(true);
        const [showUserQuestions, setShowUserQuestions] = useState(true); // 사용자 질문 보기 토글
        const [editingQuestion, setEditingQuestion] = useState(null); // 현재 수정 중인 질문
        const userIdx = localStorage.getItem('userIdx'); // 현재 사용자 ID 가져오기

        useEffect(() => {
            fetchQuestions();
        }, [showUserQuestions]); // showUserQuestions 상태가 변경될 때마다 호출

        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    alert('로그인이 필요합니다.');
                    return;
                }

                const url = showUserQuestions
                    ? `http://localhost:8080/api/users/${userIdx}/questions`
                    : 'http://localhost:8080/api/questions';

                const response = await axios.get(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setQuestions(response.data);
            } catch (error) {
                console.error('질문 목록 불러오기 오류:', error);
                alert('질문 목록을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        const handleEditClick = (question) => {
            setEditingQuestion(question);
        };

        const handleEditChange = (e) => {
            const { name, value } = e.target;
            setEditingQuestion({
                ...editingQuestion,
                [name]: value
            });
        };

        const handleEditSubmit = async (e) => {
            e.preventDefault();
            try {
                const token = localStorage.getItem('token');
                const response = await axios.put(
                    `http://localhost:8080/api/questions/${editingQuestion.queIdx}`,
                    {
                        queTitle: editingQuestion.queTitle,
                        queDescription: editingQuestion.queDescription,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setQuestions(prevQuestions => prevQuestions.map(q =>
                    q.queIdx === response.data.queIdx ? response.data : q
                ));
                setEditingQuestion(null);
                alert('질문이 수정되었습니다!');
            } catch (error) {
                console.error('질문 수정 오류:', error);
                alert('질문 수정에 실패했습니다.');
            }
        };

        const handleDeleteClick = async (queIdx) => {
            if (!window.confirm('정말로 이 질문을 삭제하시겠습니까?')) return;

            try {
                const token = localStorage.getItem('token'); // JWT 토큰 가져오기
                if (!token) {
                    alert('로그인이 필요합니다.');
                    return;
                }

                await axios.delete(`http://localhost:8080/api/questions/${queIdx}`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // 토큰을 Authorization 헤더에 추가
                    }
                });

                setQuestions(prevQuestions => prevQuestions.filter(q => q.queIdx !== queIdx));
                alert('질문이 삭제되었습니다.');
            } catch (error) {
                console.error('질문 삭제 오류:', error);
                alert('질문 삭제에 실패했습니다.');
            }
        };


        if (loading) {
            return <p>Loading...</p>;
        }

        return (
            <div className="user-qna-list">
                <div className="qna-list-item">
                    <h2>{showUserQuestions ? '내 질문 목록' : '전체 질문 목록'}</h2>
                </div>
                <div className="qna-list-item">

                </div>
                <button onClick={() => setShowUserQuestions(!showUserQuestions)}>
                    {showUserQuestions ? '전체 질문 보기' : '내 질문 보기'}
                </button>
                {questions.length === 0 ? (
                    <p>질문이 없습니다.</p>
                ) : (
                    <ul>
                        {questions.map((question) => (
                            <li key={question.queIdx}>
                                {editingQuestion && editingQuestion.queIdx === question.queIdx ? (
                                    <form onSubmit={handleEditSubmit}>
                                        <input
                                            type="text"
                                            name="queTitle"
                                            value={editingQuestion.queTitle}
                                            onChange={handleEditChange}
                                            required
                                        />
                                        <textarea
                                            name="queDescription"
                                            value={editingQuestion.queDescription}
                                            onChange={handleEditChange}
                                            required
                                        ></textarea>
                                        <button type="submit">저장</button>
                                        <button type="button" onClick={() => setEditingQuestion(null)}>취소</button>
                                    </form>
                                ) : (
                                    <>
                                        <h3>{question.queTitle}</h3>
                                        <p>{question.queDescription}</p>
                                        <p>상태: {question.status ? '처리됨' : '대기 중'}</p>
                                        <p>생성일: {new Date(question.createdAt).toLocaleString()}</p>
                                        {question.userIdx === Number(userIdx) && !question.status && (
                                            <button onClick={() => handleEditClick(question)}>수정</button>
                                        )}
                                        {question.userIdx === Number(userIdx) && (
                                            <button onClick={() => handleDeleteClick(question.queIdx)}>삭제</button>
                                        )}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    export default UserQnAList;
