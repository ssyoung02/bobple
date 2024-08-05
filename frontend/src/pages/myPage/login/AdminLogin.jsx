import React, { useState } from 'react';
import '../../../assets/style/myPage/AdminLogin.css';
import {useNavigate} from "react-router-dom";

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기에 로그인 로직 추가
        console.log('Username:', username);
        console.log('Password:', password);
    };

    const moveAdmin = () => {
        navigate('/admin/userInfo');
    }

    return (
        <div className="admin-form">
            <h3>관리자 로그인</h3>
            <form onSubmit={handleSubmit}>
                <div className="admin-container">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="admin-container">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="admin-button" onClick={moveAdmin}>Login</button>
            </form>
        </div>
    );
}

export default AdminLogin;