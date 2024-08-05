import React, { useState } from 'react';
import '../../assets/style/admin/QnAList.css';
import QnADetail from './QnADetail';
import {useNavigate} from "react-router-dom";
import mascot from '../../assets/images/bobple_mascot.png';

const initialData = [
    { id: 1, name: '홍길동', title: '문의 제목 1', date: '2024-04-08', status: '진행 중' },
    { id: 2, name: '김철수', title: '문의 제목 2', date: '2024-04-09', status: '완료' },
    { id: 3, name: '김영이', title: '문의 제목 3', date: '2024-04-10', status: '진행 중' },
    { id: 4, name: '박영수', title: '문의 제목 4', date: '2024-04-11', status: '미처리' },
    { id: 5, name: '이영희', title: '문의 제목 5', date: '2024-04-12', status: '완료' },
    { id: 6, name: '최철수', title: '문의 제목 6', date: '2024-04-13', status: '진행 중' },
    { id: 7, name: '정영수', title: '문의 제목 7', date: '2024-04-14', status: '미처리' },
    { id: 8, name: '오영희', title: '문의 제목 8', date: '2024-04-15', status: '완료' },
    { id: 9, name: '심철수', title: '문의 제목 9', date: '2024-04-16', status: '진행 중' },
    { id: 10, name: '유영수', title: '문의 제목 10', date: '2024-04-17', status: '완료' }
];

const QnAList = () => {
    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedQnAs, setSelectedQnAs] = useState([]);
    const [detailQnA, setDetailQnA] = useState(null);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDelete = (id) => {
        setData(data.filter(qna => qna.id !== id));
        setCurrentPage(1);
    };

    const handleSelectQnA = (id) => {
        setSelectedQnAs(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(qnaId => qnaId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteSelected = () => {
        setData(data.filter(qna => !selectedQnAs.includes(qna.id)));
        setSelectedQnAs([]); // 선택된 문의 초기화
        setCurrentPage(1); // 삭제 시 페이지를 첫 페이지로 초기화
    };

    const handleRowClick = (qna) => {
        setDetailQnA(detailQnA?.id === qna.id ? null : qna);
    };

    const filteredData = data.filter(qna =>
        qna.name.includes(searchTerm) || qna.title.includes(searchTerm)
    );

    // 페이지네이션
    const indexOfLastItem = currentPage * itemsPerPage; // 현재 페이지의 마지막 항목 인덱스
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 현재 페이지의 첫 번째 항목 인덱스
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem); // 현재 페이지에 해당하는 데이터

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id)); // 페이지 번호 변경
    };

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 5, 1)); // 5페이지씩 뒤로 이동
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 5, Math.ceil(filteredData.length / itemsPerPage))); // 5페이지씩 앞으로 이동
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
                        placeholder="회원 이름을 입력해주세요."
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
                            <>
                                <tr key={qna.id} onClick={() => handleRowClick(qna)}
                                    className={`tr-detail ${detailQnA?.id === qna.id ? 'active' : ''}`}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedQnAs.includes(qna.id)}
                                            onChange={() => handleSelectQnA(qna.id)}
                                            className="select-input"
                                            onClick={(e) => e.stopPropagation()} // 체크박스 클릭 시 드롭다운 방지
                                        />
                                    </td>
                                    <td>{qna.id}</td>
                                    <td>{qna.name}</td>
                                    <td>{qna.title}</td>
                                    <td>{qna.date}</td>
                                    <td>{qna.status}</td>
                                </tr>
                                {detailQnA?.id === qna.id && (
                                    <tr>
                                        <td colSpan="6">
                                            <QnADetail qna={qna}/>
                                        </td>
                                    </tr>
                                )}
                            </>
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
