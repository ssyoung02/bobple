import React, {useState, useEffect} from 'react';
import '../../assets/style/admin/UserInfo.css';
import UserDetail from './UserDetail';
import axios from 'axios';

import {useNavigate} from "react-router-dom";
import mascot from '../../assets/images/bobple_mascot.png';

const UserInfo = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [detailUser, setDetailUser] = useState(null);
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

    // const handleSearchClick = () => {
    //     setCurrentPage(1); // 검색 시 페이지를 첫 페이지로 초기화
    // };

    const handleDelete = (id) => {
        setData(data.filter(user => user.id !== id));
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
                data: {userIds: selectedUsers}, // 데이터를 Body로 전송
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

    const handleRowClick = (user) => {
        setDetailUser(detailUser?.id === user.id ? null : user);
    };

    const filteredData = data.filter(user =>
        user.name.includes(searchTerm) || user.email.includes(searchTerm)
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
    const moveBackApp = () => {
        navigate('/mypage/login');
    }

    return (
        <div className="admin-form-container">
            <div className="left-section">
                <button className="nav-button info" onClick={moveUserInfo}>회원 정보</button>
                <button className="nav-button recipe" onClick={moveRecipe}>게시글 관리</button>
                <button className="nav-button notice" onClick={moveNotice}>공지 사항</button>
                <button className="nav-button qna" onClick={moveQnA}>문의 사항</button>
                <img src={mascot} alt="밥풀이" className="admin-image"/>
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
                        {currentItems.map(user => (
                            <>
                            <tr key={user.id} onClick={() => handleRowClick(user)}
                                className={`tr-detail ${detailUser?.id === user.id ? 'active' : ''}`}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleSelectUser(user.id)}
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
                        {detailUser?.id === user.id && (
                            <tr>
                            <td colSpan="8">
                            <UserDetail user={user}/>
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
                    <button onClick={handleDeleteSelected} disabled={selectedUsers.length === 0}
                            className="admin-delete-button">삭제
                    </button>
    </div>
</div>
</div>
)
    ;
};

export default UserInfo;
