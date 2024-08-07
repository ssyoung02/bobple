import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../assets/style/myPage/serviceCenter/UserQnAList.css';
import { ArrowLeftLong, Down, Up } from "../../../components/imgcomponents/ImgComponents";
import { useNavigate } from "react-router-dom";

function UserQnAList() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUserQuestions, setShowUserQuestions] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [expandedQuestionIds, setExpandedQuestionIds] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userIdx, setUserIdx] = useState(null);

    const token = localStorage.getItem('token');
    const storedUserIdx = localStorage.getItem('userIdx');

    useEffect(() => {
        setIsLoggedIn(!!token);
        if (storedUserIdx) {
            setUserIdx(parseInt(storedUserIdx, 10));
        }
        fetchQuestions();
    }, [showUserQuestions, token, storedUserIdx]);

    const fetchQuestions = async () => {
        try {
            const url = showUserQuestions
                ? `http://localhost:8080/api/users/${userIdx}/questions`
                : 'http://localhost:8080/api/questions';

            const response = await axios.get(url, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            console.log('API Response:', response.data); // Log API response for debugging

            if (response.data.length > 0) {
                console.log('Sample question object:', response.data[0]); // Log a sample question object
            }

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
        const token = localStorage.getItem('token');
        console.log('토큰:', token);

        if (!token) {
            alert('로그인 후 다시 시도해 주세요.');
            return;
        }

        try {
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
            console.error('질문 수정 오류:', error.response?.data || error.message);
            alert('질문 수정에 실패했습니다.');
        }
    };


    const handleDeleteClick = async (queIdx) => {
        if (!window.confirm('정말로 이 질문을 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`http://localhost:8080/api/questions/${queIdx}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setQuestions(prevQuestions => prevQuestions.filter(q => q.queIdx !== queIdx));
            alert('질문이 삭제되었습니다.');
        } catch (error) {
            console.error('질문 삭제 오류:', error);
            alert('질문 삭제에 실패했습니다.');
        }
    };

    const toggleExpand = (queIdx) => {
        setExpandedQuestionIds(prev =>
            prev.includes(queIdx) ? prev.filter(id => id !== queIdx) : [...prev, queIdx]
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    };

    const moveMyPage = () => {
        navigate('/mypage');
    };

    const moveUserQnA = () => {
        navigate('/mypage/serviceCenter/userQnA');
    };

    return (
        <div className="user-qna-list-main">
            <div className="qna-list-top">
                <button aria-label="내정보로 돌아가기" onClick={moveMyPage}>
                    <ArrowLeftLong />
                </button>
                <h3>
                    {showUserQuestions ? "나의 문의내역" : "전체 문의내역"}
                </h3>
            </div>
            <div className="user-qna-list">
                <div>
                    <button
                        className={showUserQuestions ? "qna-list-item select-qna" : "qna-list-item"}
                        onClick={() => isLoggedIn && setShowUserQuestions(true)}
                        disabled={!isLoggedIn}
                    >
                        나의 문의내역
                    </button>
                    <button
                        className={showUserQuestions ? "qna-list-item" : "qna-list-item select-qna"}
                        onClick={() => setShowUserQuestions(false)}
                    >
                        전체 문의내역
                    </button>
                </div>
                {isLoggedIn && (
                    <button className="adit-qna" onClick={moveUserQnA}>
                        문의 작성
                    </button>
                )}
            </div>
            {questions.length === 0 ? (
                <div className="no-inquiries">
                    <img src="/bobple_mascot.png" alt="" width={200} />
                    <p>아직 문의한 내용이 없습니다</p>
                </div>
            ) : (
                <ul>
                    {questions.map((question) => (
                        <li key={question.queIdx}>
                            {editingQuestion && editingQuestion.queIdx === question.queIdx ? (
                                <form onSubmit={handleEditSubmit} className="qna-modify-form">
                                    <div className="qna-modify-top">
                                        <input
                                            type="text"
                                            name="queTitle"
                                            value={editingQuestion.queTitle}
                                            onChange={handleEditChange}
                                            required
                                        />
                                        <p className="qna-modify-date">{formatDate(question.createdAt)}</p>
                                    </div>
                                    <textarea
                                        name="queDescription"
                                        value={editingQuestion.queDescription}
                                        onChange={handleEditChange}
                                        required
                                    ></textarea>
                                    <div className="qna-modify-buttons">
                                        <button className="qna-modify-cancle" type="button" onClick={() => setEditingQuestion(null)}>취소</button>
                                        <button className="qna-modify-submit" type="submit">저장</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <button className="qna-title" onClick={() => toggleExpand(question.queIdx)}>
                                        <div className="qna-title-left">
                                            <div className="qna-title-top">
                                                <h6>{question.queTitle}</h6>
                                                {question.status ?
                                                    <p className="qna-waiting qna-finish">처리됨</p>
                                                    :
                                                    <p className="qna-waiting">대기중</p>
                                                }
                                            </div>
                                            <p className="qna-date">{formatDate(question.createdAt)}</p>
                                        </div>
                                        {expandedQuestionIds.includes(question.queIdx) ? <Up /> : <Down />}
                                    </button>
                                    {expandedQuestionIds.includes(question.queIdx) && (
                                        <div className="qna-content">
                                            <p>{question.queDescription}</p>
                                            <div className="qna-modify-buttons">
                                                {/* Log userIdx and question userIdx for debugging */}
                                                {console.log('User ID:', userIdx)}
                                                {console.log('Question User ID:', question.userIdx)}

                                                {/* Conditional rendering based on userIdx */}
                                                {question.userIdx === userIdx && (
                                                    <>
                                                        <button className="qna-delete" onClick={() => handleDeleteClick(question.queIdx)}>삭제</button>
                                                        <button className="qna-modify" onClick={() => handleEditClick(question)}>수정</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
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
