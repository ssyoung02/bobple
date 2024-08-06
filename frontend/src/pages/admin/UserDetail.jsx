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
                <p><strong>닉네임:</strong> {user.nickName}</p>
                <p><strong>이메일:</strong> {user.email}</p>
                <p><strong>생년월일:</strong> {user.birthdate}</p>
                <p><strong>신고:</strong> {user.reportCount}</p>
                <p><strong>가입일:</strong> {user.createdAt}</p>
            </div>
        </div>
    );
};

export default UserDetail;
