import React, { useState, useEffect } from 'react';
import '../../assets/style/admin/UserInfo.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mascot from '../../assets/images/bobple_mascot.png';

const UserInfo = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const itemsPerPage = 20;
    const navigate = useNavigate();

    // Fetch user data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectUser = (id) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(userId => userId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm("선택된 사용자를 삭제하시겠습니까?")) return;

        try {
            const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기

            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            await axios.delete('http://localhost:8080/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}` // Bearer 스키마 사용
                },
                data: { userIds: selectedUsers }, // 데이터를 Body로 전송
            });

            setData(data.filter(user => !selectedUsers.includes(user.userIdx)));
            setSelectedUsers([]);
            setCurrentPage(1);
            alert('Selected users have been deleted.');
        } catch (error) {
            console.error('Error deleting selected users:', error);
            alert('Failed to delete selected users');
        }
    };



    const filteredData = data.filter(user =>
        user.name.includes(searchTerm) || user.email.includes(searchTerm)
    );

    // Pagination
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
    }
    const moveRecipe = () => {
        navigate('../recipeBoard');
    }
    const moveNotice = () => {
        navigate('../notice');
    }
    const moveQnA = () => {
        navigate('../qnAList');
    }

    return (
        <div className="admin-form-container">
            <div className="left-section">
                <button className="nav-button" onClick={moveUserInfo}>회원 정보</button>
                <button className="nav-button" onClick={moveRecipe}>게시글 관리</button>
                <button className="nav-button" onClick={moveNotice}>공지 사항</button>
                <button className="nav-button" onClick={moveQnA}>문의 사항</button>
                <img src={mascot} alt="밥풀이" className="admin-image"/>
            </div>

            <div className="right-section">
                <h2 className="section-title">공지 사항</h2>
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
                        {currentItems.map(user => (
                            <tr key={user.userIdx}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.userIdx)}
                                        onChange={() => handleSelectUser(user.userIdx)}
                                        className="select-input"
                                    />
                                </td>
                                <td>{user.userIdx}</td>
                                <td>{user.name}</td>
                                <td>{user.nickName}</td>
                                <td>{user.email}</td>
                                <td>{user.birthdate}</td>
                                <td>{user.provider}</td>
                                <td>{user.reportCount}</td>
                                <td>{user.createdAt}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination-container">
                    <div className="pagination">
                        {renderPageNumbers()}
                    </div>
                    <button onClick={handleDeleteSelected} disabled={selectedUsers.length === 0} className="admin-delete-button">삭제</button>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
