// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api', // 백엔드 API 기본 URL 설정
    withCredentials: true, // 쿠키 등 인증 정보 전송 설정
    headers: {
        'Content-Type': 'application/json'
    }
});

// 에러 처리 인터셉터 (선택 사항)
instance.interceptors.response.use(
    response => response,
    error => {
        // TODO: 에러 처리 로직 구현
        return Promise.reject(error);
    }
);

export default instance;
