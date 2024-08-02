import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/style/mypage/MyPageMain.css'; // 상대 경로로 수정

function MyPageMain() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        birthdate: '',
        nickName: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            const userIdx = localStorage.getItem("userIdx");

            if (token && userIdx) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/users/${userIdx}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const userData = response.data;
                    setUser(userData);
                    setFormData({
                        birthdate: userData.birthdate || '',
                        nickName: userData.nickName || ''
                    });
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    navigate("/myPage/login/login");
                }
            } else {
                navigate("/myPage/login/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/myPage/login/login");
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleProfileImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profileImage", file);

        try {
            const token = localStorage.getItem("token");
            const userIdx = localStorage.getItem("userIdx");
            const response = await axios.put(`http://localhost:8080/api/users/${userIdx}/profile-image`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            const updatedUserData = response.data;
            setUser(updatedUserData);
            alert('Profile image updated successfully!');
        } catch (error) {
            console.error('Error updating profile image:', error);
            alert('Failed to update profile image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userIdx = localStorage.getItem('userIdx');
            const response = await axios.put('http://localhost:8080/api/users/update', {
                userIdx: userIdx,
                nickName: formData.nickName,
                birthdate: formData.birthdate
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            localStorage.setItem("birthdate", formData.birthdate);
            localStorage.setItem("nickName", formData.nickName);

            setUser(prevUser => ({
                ...prevUser,
                birthdate: formData.birthdate,
                nickName: formData.nickName
            }));

            setEditMode(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("정말로 회원탈퇴 하시겠습니까?")) return;

        try {
            const token = localStorage.getItem('token');
            const userIdx = localStorage.getItem('userIdx');
            await axios.delete(`http://localhost:8080/api/users/${userIdx}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            alert('회원탈퇴가 완료되었습니다.');
            localStorage.clear();
            navigate("/myPage/login/login");
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account');
        }
    };

    return (
        <div className="my-page-main">
            {user ? (
                <>
                    <h1>My Page Main</h1>
                    <div className="user-info">
                        <img src={user.profileImage} alt="Profile" className="profile-image"/>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            style={{ display: 'none' }}
                            id="profileImageInput"
                        />
                        <label htmlFor="profileImageInput" className="upload-btn">
                            +
                        </label>
                        <p>Welcome, {user.name}!</p>
                        <p>Email: {user.email}</p>
                        <p>Birthdate: {user.birthdate || formData.birthdate}</p>
                        <p>Nickname: {user.nickName || formData.nickName}</p>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        <button className="edit-btn" onClick={handleEditToggle}>
                            {editMode ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                    {editMode && (
                        <form onSubmit={handleSubmit} className="edit-form">
                            <label>
                                Birthdate:
                                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange}/>
                            </label>
                            <br/>
                            <label>
                                Nickname:
                                <input type="text" name="nickName" value={formData.nickName} onChange={handleChange}/>
                            </label>
                            <br/>
                            <button className="save-btn" type="submit">Save Changes</button>
                        </form>
                    )}
                    {/* 회원탈퇴 버튼 추가 */}
                    <button className="delete-account-btn" onClick={handleDeleteAccount}>회원탈퇴하기</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default MyPageMain;
