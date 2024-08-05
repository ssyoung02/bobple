import React from 'react';
import '../../assets/style/admin/UserDetail.css';

const UserDetail = ({ user }) => {
    if (!user) return null;

    return (
        <div className="user-detail-container">
            <h3>회원 상세 정보</h3>
            <hr/>
            <div className="user-detail">
                <p><strong>이름:</strong> {user.name}</p>
                <p><strong>성별:</strong> {user.gender}</p>
                <p><strong>이메일:</strong> {user.email}</p>
                <p><strong>생년월일:</strong> {user.dob}</p>
                <p><strong>전화번호:</strong> {user.phone}</p>
                <p><strong>가입일:</strong> {user.joinDate}</p>
            </div>
        </div>
    );
};

export default UserDetail;
