import React, { useState, useEffect } from 'react';
import '../../assets/style/admin/UserInfo.css';
import UserDetail from './UserDetail';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import mascot from '../../assets/images/bobple_mascot.png';

const UserInfo = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [detailUser, setDetailUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/api/admin/users');
                console.log(response.data);

                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    setError('올바른 사용자 목록을 받지 못했습니다.');
                }
            } catch (error) {
                setError('데이터를 가져오는 데 실패했습니다.');
                console.error('사용자 가져오기 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDelete = (id) => {
        setData(data.filter(user => user.userIdx !== id));
        setCurrentPage(1);
    };

    const handleSelectUser = (id) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(userId => userId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedUsers.length === 0) return;

        try {
            const token = localStorage.getItem('token'); // 저장된 토큰을 가져옵니다.
            if (!token) {
                setError('인증 토큰이 없습니다.');
                return;
            }

            const response = await axios.delete('http://localhost:8080/api/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: selectedUsers
            });

            if (response.status === 200) {
                setData(data.filter(user => !selectedUsers.includes(user.userIdx)));
                setSelectedUsers([]);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('사용자 삭제 오류:', error);
            setError('사용자를 삭제하는 데 실패했습니다.');
        }
    };

    const handleRowClick = (user) => {
        setDetailUser(detailUser?.userIdx === user.userIdx ? null : user);
    };

    const filteredData = data.filter(user =>
        user.name.includes(searchTerm) || user.email.includes(searchTerm)
    );

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
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="admin-form-container">
            <div className="left-section">
                <button className="nav-button info" onClick={moveUserInfo}>회원 정보</button>
                <button className="nav-button recipe" onClick={moveRecipe}>게시글 관리</button>
                <button className="nav-button notice" onClick={moveNotice}>공지 사항</button>
                <button className="nav-button qna" onClick={moveQnA}>문의 사항</button>
                <img src={mascot} alt="밥풀이" className="admin-image" />
            </div>

            <div className="right-section">
                <div className="right-header">
                    <h2 className="section-title">회원 정보</h2>
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
                            <th>이름</th>
                            <th>닉네임</th>
                            <th>이메일</th>
                            <th>생년월일</th>
                            <th>소셜로그인</th>
                            <th>신고</th>
                            <th>가입일</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((user, index) => (
                            <React.Fragment key={user.userIdx}>
                                <tr onClick={() => handleRowClick(user)}
                                    className={`tr-detail ${detailUser?.userIdx === user.userIdx ? 'active' : ''}`}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.userIdx)}
                                            onChange={() => handleSelectUser(user.userIdx)}
                                            className="select-input"
                                            onClick={(e) => e.stopPropagation()}
                                            disabled={index === 0} // 첫 번째 유저의 체크박스 비활성화
                                        />
                                    </td>
                                    <td>{user.userIdx}</td>
                                    <td>{user.name}</td>
                                    <td>{user.nickName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.birthdate || 'N/A'}</td>
                                    <td>{user.provider}</td>
                                    <td>{user.reportCount}</td>
                                    <td>{user.createdAt.split('T')[0]}</td>
                                </tr>
                                {detailUser?.userIdx === user.userIdx && (
                                    <tr>
                                        <td colSpan="9">
                                            <UserDetail user={user} />
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
                    <button onClick={handleDeleteSelected} disabled={selectedUsers.length === 0}
                            className="admin-delete-button">삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
