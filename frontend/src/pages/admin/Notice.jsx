import React, { useState } from 'react';
import '../../assets/style/admin/UserInfo.css';
import {useNavigate} from "react-router-dom";
import mascot from '../../assets/images/bobple_mascot.png';

const initialData = [
    { id: 1000, name: '홍길동', gender: 'M', email: 'hong1@naver.com', dob: '1990-01-01', phone: '010-1234-5678', joinDate: '2024-04-08' },
    { id: 1001, name: '김철수', gender: 'M', email: 'kim1@daum.net', dob: '1995-06-01', phone: '010-2345-6789', joinDate: '2024-04-08' },
    { id: 1002, name: '김영이', gender: 'F', email: 'young1@gmail.com', dob: '1996-10-01', phone: '010-3456-7890', joinDate: '2024-04-08' },
    { id: 1003, name: '박영수', gender: 'M', email: 'park1@naver.com', dob: '1992-03-12', phone: '010-5678-1234', joinDate: '2024-04-08' },
    { id: 1004, name: '이영희', gender: 'F', email: 'lee1@gmail.com', dob: '1991-05-23', phone: '010-6789-1234', joinDate: '2024-04-08' },
    { id: 1005, name: '최철수', gender: 'M', email: 'choi1@daum.net', dob: '1993-07-14', phone: '010-7890-1234', joinDate: '2024-04-08' },
    { id: 1006, name: '정영수', gender: 'M', email: 'jung1@naver.com', dob: '1988-09-30', phone: '010-8901-1234', joinDate: '2024-04-08' },
    { id: 1007, name: '오영희', gender: 'F', email: 'oh1@gmail.com', dob: '1997-11-21', phone: '010-9012-1234', joinDate: '2024-04-08' },
    { id: 1008, name: '심철수', gender: 'M', email: 'shim1@daum.net', dob: '1994-12-15', phone: '010-0123-1234', joinDate: '2024-04-08' },
    { id: 1009, name: '유영수', gender: 'M', email: 'you1@naver.com', dob: '1989-02-20', phone: '010-1234-2345', joinDate: '2024-04-08' },
    { id: 1010, name: '문영희', gender: 'F', email: 'moon1@gmail.com', dob: '1990-04-05', phone: '010-2345-3456', joinDate: '2024-04-08' },
    { id: 1011, name: '장철수', gender: 'M', email: 'jang1@daum.net', dob: '1992-06-17', phone: '010-3456-4567', joinDate: '2024-04-08' },
    { id: 1012, name: '한영수', gender: 'M', email: 'han1@naver.com', dob: '1987-08-29', phone: '010-4567-5678', joinDate: '2024-04-08' },
    { id: 1013, name: '강영희', gender: 'F', email: 'kang1@gmail.com', dob: '1995-10-10', phone: '010-5678-6789', joinDate: '2024-04-08' },
    { id: 1014, name: '고철수', gender: 'M', email: 'ko1@daum.net', dob: '1986-12-19', phone: '010-6789-7890', joinDate: '2024-04-08' },
    { id: 1015, name: '홍영수', gender: 'M', email: 'hong2@naver.com', dob: '1989-03-15', phone: '010-7890-8901', joinDate: '2024-04-08' },
    { id: 1016, name: '김영희', gender: 'F', email: 'kim2@gmail.com', dob: '1993-05-22', phone: '010-8901-9012', joinDate: '2024-04-08' },
    { id: 1017, name: '남철수', gender: 'M', email: 'nam1@daum.net', dob: '1991-07-14', phone: '010-9012-0123', joinDate: '2024-04-08' },
    { id: 1018, name: '도영수', gender: 'M', email: 'do1@naver.com', dob: '1988-09-25', phone: '010-0123-2345', joinDate: '2024-04-08' },
    { id: 1019, name: '류영희', gender: 'F', email: 'ryu1@gmail.com', dob: '1996-11-05', phone: '010-1234-3456', joinDate: '2024-04-08' },
    { id: 1020, name: '임철수', gender: 'M', email: 'lim1@naver.com', dob: '1990-06-15', phone: '010-3456-7891', joinDate: '2024-04-08' },
    { id: 1021, name: '윤영희', gender: 'F', email: 'yoon1@gmail.com', dob: '1992-12-10', phone: '010-2345-6781', joinDate: '2024-04-08' },
    { id: 1022, name: '신영수', gender: 'M', email: 'shin1@daum.net', dob: '1989-01-01', phone: '010-1234-5679', joinDate: '2024-04-08' },
    { id: 1023, name: '구영희', gender: 'F', email: 'koo1@gmail.com', dob: '1995-03-05', phone: '010-4567-7890', joinDate: '2024-04-08' },
    { id: 1024, name: '황철수', gender: 'M', email: 'hwang1@naver.com', dob: '1994-07-20', phone: '010-5678-9012', joinDate: '2024-04-08' }
];

const UserInfo = () => {
    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const itemsPerPage = 20;
    const navigate = useNavigate();

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

    const handleDeleteSelected = () => {
        setData(data.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]); // 선택된 회원 초기화
        setCurrentPage(1); // 삭제 시 페이지를 첫 페이지로 초기화
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
                            <th>성별</th>
                            <th>이메일</th>
                            <th>생년월일</th>
                            <th>전화번호</th>
                            <th>가입일</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleSelectUser(user.id)}
                                        className="select-input"
                                    />
                                </td>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.gender}</td>
                                <td>{user.email}</td>
                                <td>{user.dob}</td>
                                <td>{user.phone}</td>
                                <td>{user.joinDate}</td>
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
