import React, { useState } from 'react';
import '../../../assets/style/myPage/AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/admin/login', {
                username: username,
                email: password
            });

            if (response.status === 200) {
                console.log('Login successful');
                localStorage.setItem('token', response.data.token);
                navigate('/admin/userInfo');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('관리자 아이디 혹은 비밀번호가 틀렸습니다.');
        }
    };

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
                <button type="submit" className="admin-button">Login</button>
            </form>
        </div>
    );
}

export default AdminLogin;
