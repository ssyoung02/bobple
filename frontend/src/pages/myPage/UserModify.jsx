import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/style/myPage/UserModify.css';
import { ModifyPen } from "../../components/imgcomponents/ImgComponents";
import PageHeader from "../../components/layout/PageHeader";

function UserModify() {
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
            alert('프로필 이미지 수정이 완료되었습니다.');
        } catch (error) {
            console.error('Error updating profile image:', error);
            alert('이미지 업로드에 실패하였습니다.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const userIdx = localStorage.getItem('userIdx');

            if (!token || !userIdx) {
                throw new Error('Token or UserIdx not found');
            }

            const response = await axios.put(`http://localhost:8080/api/users/update`, {
                userIdx: userIdx,
                nickName: formData.nickName,
                birthdate: formData.birthdate
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
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
            alert('회원정보 수정이 완료되었습니다.');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('회원정보 수정에 실패하였습니다.');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("정말로 회원탈퇴 하시겠습니까?")) return;

        try {
            const token = localStorage.getItem('token');
            const userIdx = localStorage.getItem('userIdx');

            if (!token || !userIdx) {
                console.error('Token or UserIdx not found');
                return;
            }

            await axios.delete(`http://localhost:8080/api/users/${userIdx}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });

            alert('회원탈퇴가 완료되었습니다.');
            localStorage.clear();
            // Redirect to the main page after account deletion
            window.location.href = 'http://localhost:3000/';
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account');
        }
    };



    return (
        <div className="UserModify-main">
            <PageHeader title="개인정보 수정" />
            <div className="profile">
                {user && user.profileImage && (
                    <img src={user.profileImage} alt="Profile" className="profile-image" />
                )}
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
            </div>

            <form onSubmit={handleSubmit} id="user-modify-form">
                {editMode ?
                    <input className="nickname" type="text" name="nickName" value={formData.nickName}
                           onChange={handleChange} />
                    :
                    <div className="nickname-form">
                        <input className="nickname" value={user ? (user.nickName || formData.nickName) : ''}
                               readOnly="readOnly" title="닉네임" />
                        <button type="button" className="edit-btn" onClick={handleEditToggle} aria-label="회원정보 수정">
                            <ModifyPen />
                        </button>
                    </div>
                }
                <ul className="user-data">
                    <li>
                        <dt><label>이름</label></dt>
                        <dd>{user ? user.name : ''}</dd>
                    </li>
                    <li>
                        <dt><label>계정</label></dt>
                        <dd>{user ? user.email : ''}</dd>
                    </li>
                    <li>
                        <dt><label>생일</label></dt>
                        <dd>
                            {editMode ?
                                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange}
                                       title="생년월일" /> :
                                <>{user ? (user.birthdate || formData.birthdate) : ''}</>
                            }
                        </dd>
                    </li>
                    {/*<li>*/}
                    {/*    <dt><label>소속</label></dt>*/}
                    {/*    <dd><input className="affiliation" type="text" /></dd>*/}
                    {/*</li>*/}
                </ul>
            </form>
            <div className="user-modify-buttons">
                {editMode &&
                    <>
                        <button type="button" className="user-modify-close" onClick={handleEditToggle}>
                            취소
                        </button>
                        <button className="user-modify-save" type="submit" form="user-modify-form">수정</button>
                    </>
                }
            </div>
            <div className="delete-user">
                <button className="delete-account-btn" onClick={handleDeleteAccount}>회원탈퇴</button>
            </div>
        </div>
    );
}

export default UserModify;
