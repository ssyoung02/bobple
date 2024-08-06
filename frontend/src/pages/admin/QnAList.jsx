import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/style/admin/QnAList.css';
import QnADetail from './QnADetail';
import { useNavigate } from "react-router-dom";
import mascot from '../../assets/images/bobple_mascot.png';

const QnAList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedQnAs, setSelectedQnAs] = useState([]);
    const [detailQnA, setDetailQnA] = useState(null);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true); // 데이터 로딩 시작
            try {
                const response = await axios.get('http://localhost:8080/api/admin/questions', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log(response.data); // 데이터 확인
                setData(response.data || []); // 응답이 없을 경우 빈 배열로 초기화
            } catch (error) {
                console.error('질문 목록 불러오기 오류:', error);
                alert('질문 목록을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false); // 데이터 로딩 종료
            }
        };

        fetchQuestions();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDelete = (id) => {
        setData(data.filter(qna => qna.queIdx !== id));
        setCurrentPage(1);
    };

    const handleSelectQnA = (id) => {
        setSelectedQnAs(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(qnaId => qnaId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteSelected = async () => {
        try {
            await axios.delete('http://localhost:8080/api/admin/questions', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                data: selectedQnAs
            });
            setData(data.filter(qna => !selectedQnAs.includes(qna.queIdx)));
            setSelectedQnAs([]);
            setCurrentPage(1);
        } catch (error) {
            console.error('선택된 질문 삭제 오류:', error);
            alert('선택된 질문 삭제에 실패했습니다.');
        }
    };

    const handleRowClick = (qna) => {
        setDetailQnA(detailQnA?.queIdx === qna.queIdx ? null : qna);
    };

    const filteredData = data.filter(qna => {
        const titleIncludes = qna.queTitle ? qna.queTitle.includes(searchTerm) : false;
        return titleIncludes;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 5, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 5, Math.ceil(filteredData.length / itemsPerPage)));
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }
        const startPage = Math.floor((currentPage - 1) / 5) * 5;
        return (
            <>
                <button onClick={handlePrev}>{'<<'}</button>
                {pageNumbers.slice(startPage, startPage + 5).map(number => (
                    <button
                        key={number}
                        id={number}
                        onClick={handleClick}
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}
                <button onClick={handleNext}>{'>>'}</button>
            </>
        );
    };

    const moveUserInfo = () => {
        navigate('../userInfo');
    };
    const moveRecipe = () => {
        navigate('../recipeBoard');
    };
    const moveNotice = () => {
        navigate('../notice');
    };
    const moveQnA = () => {
        navigate('../qnAList');
    };
    const moveBackApp = () => {
        navigate('/mypage/login');
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="admin-form-container-q">
            <div className="left-section">
                <button className="nav-button-q info" onClick={moveUserInfo}>회원 정보</button>
                <button className="nav-button-q recipe" onClick={moveRecipe}>게시글 관리</button>
                <button className="nav-button-q notice" onClick={moveNotice}>공지 사항</button>
                <button className="nav-button-q qna" onClick={moveQnA}>문의 사항</button>
                <img src={mascot} alt="밥풀이" className="admin-image"/>
            </div>

            <div className="right-section">
                <div className="right-header">
                    <h2 className="section-title">문의 사항</h2>
                    <button onClick={moveBackApp} className="back-app-btn">x</button>
                </div>
                <div className="admin-search-bar">
                    <input
                        className="admin-search-input"
                        type="text"
                        placeholder="질문 제목을 입력해주세요."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>선택</th>
                            <th>번호</th>
                            <th>작성자</th>
                            <th>제목</th>
                            <th>작성일자</th>
                            <th>진행상황</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map(qna => (
                            <React.Fragment key={qna.queIdx}>
                                <tr onClick={() => handleRowClick(qna)}
                                    className={`tr-detail ${detailQnA?.queIdx === qna.queIdx ? 'active' : ''}`}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedQnAs.includes(qna.queIdx)}
                                            onChange={() => handleSelectQnA(qna.queIdx)}
                                            className="select-input"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td>{qna.queIdx}</td>
                                    <td>{qna.userName}</td>
                                    <td>{qna.queTitle}</td>
                                    <td>{new Date(qna.createdAt).toLocaleDateString()}</td>
                                    <td>{qna.status ? '완료' : '진행 중'}</td>
                                </tr>
                                {detailQnA?.queIdx === qna.queIdx && (
                                    <tr>
                                        <td colSpan="6">
                                            <QnADetail qna={qna}/>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination-container">
                    <div className="pagination">
                        {renderPageNumbers()}
                    </div>
                    <button onClick={handleDeleteSelected} disabled={selectedQnAs.length === 0}
                            className="admin-delete-button">삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QnAList;
