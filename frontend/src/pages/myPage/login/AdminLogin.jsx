import React, { useState } from 'react';
import '../../../assets/style/myPage/AdminLogin.css';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Example logic: replace this with real authentication API call
        const hardcodedUsername = 'admin'; // Replace with real username
        const hardcodedPassword = 'admin'; // Replace with real password (hashed in production)

        if (username === hardcodedUsername && password === hardcodedPassword) {
            console.log('Login successful');
            navigate('/admin/userInfo'); // Redirect to admin/userInfo on successful login
        } else {
            console.error('Login failed: Incorrect username or password');
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
