import React, { useState } from 'react';
import axios from 'axios';

function NoticeContext() {
    // 공지사항 제목과 내용을 저장하는 상태
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 폼 제출을 처리하는 함수
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 공지사항 객체 생성
        const notice = {
            noticeTitle: title,
            noticeDescription: content,
        };

        try {
            // 로컬 스토리지에서 토큰 가져오기
            const token = localStorage.getItem('token');
            console.log('사용하는 토큰:', token); // 토큰을 콘솔에 출력

            // 토큰이 없는 경우 처리
            if (!token) {
                alert('로그인이 필요합니다.');
                return;
            }

            // 서버에 공지사항 전송
            const response = await axios.post('http://localhost:8080/api/notices', notice, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                // 성공적으로 공지사항 저장
                console.log('공지사항 제출:', response.data);
                alert('공지사항이 성공적으로 저장되었습니다.');
            } else {
                // 오류 처리
                console.error('오류 응답:', response.data);
                alert('공지사항 저장 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('공지사항 제출 오류:', error);
            if (error.response && error.response.data) {
                alert(`오류가 발생했습니다: ${error.response.data.message}`);
            } else {
                alert('네트워크 오류가 발생했습니다.');
            }
        }

        // 폼 필드 초기화
        setTitle('');
        setContent('');
    };

    return (
        <div>
            <h2>공지사항 작성</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">제목:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">내용:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">공지사항 제출</button>
            </form>
        </div>
    );
}

export default NoticeContext;
