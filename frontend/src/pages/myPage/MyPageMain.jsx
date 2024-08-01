import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyPageMain() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = {
            username: localStorage.getItem("username"),
            email: localStorage.getItem("email"),
            name: localStorage.getItem("name"),
            profileImage: localStorage.getItem("profileImage"),
            provider: localStorage.getItem("provider"),
            companyId: localStorage.getItem("companyId"),
            reportCount: localStorage.getItem("reportCount"),
            point: localStorage.getItem("point"),
            token: localStorage.getItem("token")
        };

        if (userData.token) {
            setUser(userData);
        } else {
            // 사용자가 로그인하지 않았을 경우 로그인 페이지로 리다이렉트
            navigate("/myPage/login/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        localStorage.removeItem("profileImage");
        localStorage.removeItem("provider");
        localStorage.removeItem("companyId");
        localStorage.removeItem("reportCount");
        localStorage.removeItem("point");
        localStorage.removeItem("token");

        navigate("/myPage/login/login");
    };

    return(
        <>
            {user ? (
                <>
                    {/* 로그인된 사용자만 볼 수 있는 내용 */}
                    <h1>My Page Main</h1>
                    <p>Welcome, {user.name}!</p>
                    <p>Email: {user.email}</p>
                    <img src={user.profileImage} alt="Profile" />
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}

export default MyPageMain;
