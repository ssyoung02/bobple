import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/style/admin/Notice.css';
import { useNavigate } from 'react-router-dom';
import mascot from '../../assets/images/bobple_mascot.png';
import NoticeModify from './NoticeModify';

const Notice = () => {
    const [data, setData] = useState([]); // 데이터 초기값을 빈 배열로 설정
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNotices, setSelectedNotices] = useState([]);
    const [detailNotice, setDetailNotice] = useState(null);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                // 토큰 가져오기
                const token = localStorage.getItem('token');

                // 토큰이 없을 경우 경고 표시
                if (!token) {
                    alert('로그인이 필요합니다.');
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/notices', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // 인증 토큰 포함
                    },
                });
                console.log('Fetched Data:', response.data); // Fetch한 데이터 콘솔에 출력
                setData(response.data); // 서버에서 받은 데이터로 상태 업데이트
            } catch (error) {
                console.error('공지사항을 불러오는 중 오류가 발생했습니다:', error);
                alert('공지사항을 불러오는 중 오류가 발생했습니다.');
            }
        };

        fetchNotices();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDelete = (noticeIdx) => {
        setData(data.filter(notice => notice.noticeIdx !== noticeIdx));
        setCurrentPage(1);
    };

    const handleSelectNotice = (noticeIdx) => {
        setSelectedNotices(prevSelected =>
            prevSelected.includes(noticeIdx)
                ? prevSelected.filter(id => id !== noticeIdx)
                : [...prevSelected, noticeIdx]
        );
    };

    const handleDeleteSelected = async () => {
        try {
            // 선택된 공지 삭제
            const token = localStorage.getItem('token');
            for (const noticeIdx of selectedNotices) {
                await axios.delete(`http://localhost:8080/api/notices/${noticeIdx}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }
            // 선택된 공지를 데이터에서 제거
            setData(data.filter(notice => !selectedNotices.includes(notice.noticeIdx)));
            setSelectedNotices([]);
            setCurrentPage(1);
        } catch (error) {
            console.error('공지사항 삭제 중 오류가 발생했습니다:', error);
            alert('공지사항 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleRowClick = (notice) => {
        setDetailNotice(detailNotice?.noticeIdx === notice.noticeIdx ? null : notice);
    };

    const filteredData = data.filter(notice =>
        (notice.noticeTitle?.includes(searchTerm))
    );

    // 페이지네이션
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
                            <th>제목</th>
                            <th>작성일자</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map(notice => (
                            <React.Fragment key={notice.noticeIdx}>
                                <tr onClick={() => handleRowClick(notice)}
                                    className={`tr-detail ${detailNotice?.noticeIdx === notice.noticeIdx ? 'active' : ''}`}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedNotices.includes(notice.noticeIdx)}
                                            onChange={() => handleSelectNotice(notice.noticeIdx)}
                                            className="select-input"
                                            onClick={(e) => e.stopPropagation()} // 체크박스 클릭 시 드롭다운 방지
                                        />
                                    </td>
                                    <td>{notice.noticeIdx}</td>
                                    <td>{notice.noticeTitle}</td>
                                    <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                                </tr>
                                {detailNotice?.noticeIdx === notice.noticeIdx && (
                                    <tr>
                                        <td colSpan="4">
                                            <NoticeModify notice={notice} />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
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
