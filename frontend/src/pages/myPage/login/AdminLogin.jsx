import React, { useState } from 'react';
import '../../../assets/style/myPage/AdminLogin.css';

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기에 로그인 로직 추가
        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <div className="login-form">
            <h3>관리자 로그인</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
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