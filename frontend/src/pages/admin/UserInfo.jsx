import React, { useState } from 'react';
import '../../assets/style/admin/UserInfo.css';

const initialData = [
    { id: 1000, name: '홍길동', gender: 'M', email: 'hong1@naver.com', dob: '1990-01-01', phone: '010-1234-5678', joinDate: '2024-04-08' },
    { id: 1001, name: '김철수', gender: 'M', email: 'kim1@daum.net', dob: '1995-06-01', phone: '010-2345-6789', joinDate: '2024-04-08' },
    { id: 1002, name: '김영희', gender: 'F', email: 'young1@gmail.com', dob: '1996-10-01', phone: '010-3456-7890', joinDate: '2024-04-08' }
];

const UserInfo = () => {
    const [data, setData] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDelete = (id) => {
        setData(data.filter(user => user.id !== id));
    };

    const filteredData = data.filter(user =>
        user.name.includes(searchTerm) || user.email.includes(searchTerm)
    );

    return (
        <div className="admin-form-container">
            <div className="left-section">
                <button className="nav-button" onClick={() => alert('회원 정보')}>회원 정보</button>
                <button className="nav-button" onClick={() => alert('레시피 관리')}>레시피 관리</button>
                <button className="nav-button" onClick={() => alert('공지 사항')}>공지 사항</button>
                <button className="nav-button" onClick={() => alert('문의 사항')}>문의 사항</button>
            </div>
            <div className="right-section">
                <h2 className="section-title">회원 정보</h2>
                <div className="admin-search-bar">
                    <input
                        className="admin-search-input"
                        type="text"
                        placeholder="회원 이름"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button className="refresh-button" onClick={() => setSearchTerm('')}>새로고침</button>
                </div>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>이름</th>
                        <th>성별</th>
                        <th>이메일</th>
                        <th>생년월일</th>
                        <th>전화번호</th>
                        <th>가입일</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.gender}</td>
                            <td>{user.email}</td>
                            <td>{user.dob}</td>
                            <td>{user.phone}</td>
                            <td>{user.joinDate}</td>
                            <td>
                                <button className="admin-delete-button" onClick={() => handleDelete(user.id)}>삭제</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserInfo;
