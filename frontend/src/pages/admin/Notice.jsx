import React, { useState } from 'react';
import '../../assets/style/admin/Notice.css';
import {useNavigate} from "react-router-dom";
import mascot from '../../assets/images/bobple_mascot.png';
import NoticeModify from "./NoticeModify";

const initialData = [
    { id: 1, author: '관리자', title: '첫 번째 공지사항', date: '2024-01-01', description: '본문1'},
    { id: 2, author: '관리자', title: '두 번째 공지사항', date: '2024-01-05', description: '본문2' },
    { id: 3, author: '관리자', title: '세 번째 공지사항', date: '2024-02-10', description: '본문3' },
    { id: 4, author: '관리자', title: '네 번째 공지사항', date: '2024-03-15', description: '본문4' },
    { id: 5, author: '관리자', title: '다섯 번째 공지사항', date: '2024-04-20', description: '본문5' },
    { id: 6, author: '관리자', title: '여섯 번째 공지사항', date: '2024-05-25', description: '본문6' },
    { id: 7, author: '관리자', title: '일곱 번째 공지사항', date: '2024-06-30', description: '본문7' },
    { id: 8, author: '관리자', title: '여덟 번째 공지사항', date: '2024-07-05', description: '본문8' },
    { id: 9, author: '관리자', title: '아홉 번째 공지사항', date: '2024-08-10', description: '본문9' },
    { id: 10, author: '관리자', title: '열 번째 공지사항', date: '2024-09-15', description: '본문10' }
];

const Notice = () => {
    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNotices, setSelectedNotices] = useState([]);
    const [detailNotice, setDetailNotice] = useState(null);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDelete = (id) => {
        setData(data.filter(notice => notice.id !== id));
        setCurrentPage(1);
    };

    const handleSelectNotice = (id) => {
        setSelectedNotices(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(noticeId => noticeId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteSelected = () => {
        setData(data.filter(notice => !selectedNotices.includes(notice.id)));
        setSelectedNotices([]); // 선택된 공지 초기화
        setCurrentPage(1); // 삭제 시 페이지를 첫 페이지로 초기화
    };

    const handleRowClick = (notice) => {
        setDetailNotice(detailNotice?.id === notice.id ? null : notice);
    };

    const filteredData = data.filter(notice =>
        notice.title.includes(searchTerm) || notice.author.includes(searchTerm)
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
    const moveNoticeContext = () => {
        navigate('../noticeContext');
    };
    const moveBackApp = () => {
        navigate('/mypage/login');
    }

    return (
        <div className="admin-form-container-n">
            <div className="left-section">
                <button className="nav-button-n info" onClick={moveUserInfo}>회원 정보</button>
                <button className="nav-button-n recipe" onClick={moveRecipe}>게시글 관리</button>
                <button className="nav-button-n notice" onClick={moveNotice}>공지 사항</button>
                <button className="nav-button-n qna" onClick={moveQnA}>문의 사항</button>
                <img src={mascot} alt="밥풀이" className="admin-image"/>
            </div>

            <div className="right-section">
                <div className="right-header">
                    <h2 className="section-title">공지 사항</h2>
                    <button onClick={moveBackApp} className="back-app-btn">x</button>
                </div>
                <div className="admin-search-bar">
                    <input
                        className="admin-search-input"
                        type="text"
                        placeholder="제목을 입력해주세요."
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
                        </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(notice => (
                                <>
                                    <tr key={notice.id} onClick={() => handleRowClick(notice)}
                                        className={`tr-detail ${detailNotice?.id === notice.id ? 'active' : ''}`}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedNotices.includes(notice.id)}
                                                onChange={() => handleSelectNotice(notice.id)}
                                                className="select-input"
                                                onClick={(e) => e.stopPropagation()} // 체크박스 클릭 시 드롭다운 방지
                                            />
                                        </td>
                                        <td>{notice.id}</td>
                                        <td>{notice.author}</td>
                                        <td>{notice.title}</td>
                                        <td>{notice.date}</td>
                                    </tr>
                                    {detailNotice?.id === notice.id && (
                                        <tr>
                                            <td colSpan="5">
                                                <NoticeModify notice={notice} />
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination-container">
                    <button onClick={moveNoticeContext} className="admin-write-button">글쓰기</button>
                    <div className="pagination">
                        {renderPageNumbers()}
                    </div>
                    <button onClick={handleDeleteSelected} disabled={selectedNotices.length === 0}
                            className="admin-delete-button">삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notice;
