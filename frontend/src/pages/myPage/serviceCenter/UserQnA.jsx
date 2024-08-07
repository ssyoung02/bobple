import React, { useState } from 'react';
import axios from 'axios';
import '../../../assets/style/myPage/serviceCenter/UserQnA.css';
import { ArrowLeftLong, LargeX } from "../../../components/imgcomponents/ImgComponents";
import { useNavigate } from "react-router-dom";

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
                userIdx: parseInt(userIdx, 10), // `userIdx`가 숫자로 변환되는지 확인
                queTitle: formData.title,
                queDescription: formData.content
            };

            const response = await axios.post('http://localhost:8080/api/questions', question, {
                headers: {
                    'Authorization': `Bearer ${token}`, // 인증 헤더 추가
                    'Content-Type': 'application/json' // 올바른 Content-Type 설정
                }
            });

            console.log('질문 제출:', response.data);
            setFormData({ title: '', content: '' });
            alert('질문이 제출되었습니다!');
            navigate('/mypage/serviceCenter/userQnAList');
        } catch (error) {
            console.error('질문 제출 오류:', error.response || error.message); // 수정된 부분
            alert('질문 제출에 실패했습니다.');
        }
    };

    const navigate = useNavigate();

    const moveUserQnAList = () => {
        navigate('/mypage/serviceCenter/userQnAList');
    };

    return (
        <div className="user-qna">
            <div className="qna-adit-top">
                <h3>문의하기</h3>
                <button aria-label="문의하기 닫기" onClick={moveUserQnAList}>
                    <LargeX />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="qna-form">
                <div>
                    <label htmlFor="qna-form-title">문의 제목</label>
                    <input
                        type="text"
                        id="qna-form-title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="문의 제목을 작성해주세요"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="qna-form-content">문의 내용</label>
                    <textarea
                        id="qna-form-content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="문의 내용을 작성해주세요"
                        required
                    ></textarea>
                </div>
                <div className="qna-caution">
                    <h5>문의 시 유의사항</h5>
                    <ul>
                        <li>
                            - 문의 내용에 개인정보가 포함되지 않도록 주의해주세요<br /> (예: 전화번호, 이메일, 환불계좌번호 등)
                        </li>
                        <li>
                            - 부적절한 게시물 등록 시 ID이용 제한 및 게시물이 삭제될 수 있습니다
                        </li>
                    </ul>
                </div>
                <button className="qna-adit-submit" type="submit">제출</button>
            </form>
        </div>
    );
}

export default UserQnA;
