import React, { useState } from 'react';
import axios from 'axios';
import '../../../assets/style/myPage/serviceCenter/UserQnA.css';

function UserQnA() {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userIdx = localStorage.getItem('userIdx'); // 사용자 ID
            const token = localStorage.getItem('token'); // JWT 토큰

            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            const question = {
                userIdx: userIdx,
                queTitle: formData.title,
                queDescription: formData.content
            };

            const response = await axios.post('http://localhost:8080/api/questions', question, {
                headers: {
                    'Authorization': `Bearer ${token}` // 인증 헤더 추가
                }
            });

            console.log('질문 제출:', response.data);
            setFormData({ title: '', content: '' });
            alert('질문이 제출되었습니다!');
        } catch (error) {
            console.error('질문 제출 오류:', error);
            alert('질문 제출에 실패했습니다.');
        }
    };

    return (
        <div className="user-qna">
            <h2>질문하기</h2>
            <form onSubmit={handleSubmit} className="qna-form">
                <div>
                    <label htmlFor="title">제목:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">내용:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit">제출</button>
            </form>
        </div>
    );
}

export default UserQnA;
