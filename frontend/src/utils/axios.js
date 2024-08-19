// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터 (토큰 설정)
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        console.log('Token:', token);  // 콘솔에 토큰 출력
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userNickname');
            localStorage.removeItem('userId');
            localStorage.removeItem('userIdx');
            localStorage.removeItem('name');
            localStorage.removeItem('email');
            localStorage.removeItem('recipePage');
            localStorage.removeItem('latestRecipes');
            localStorage.removeItem('lastLoadedKey');
            localStorage.removeItem('recommendedRecipes');

            window.location.href = '/myPage/login';
            return Promise.reject({ ...error, redirectTo: '/myPage/login' });
        } else if (error.response) {
            // 서버 응답 에러 (4xx, 5xx) 처리
            const errorMessage = getErrorMessage(error.response);
            alert(errorMessage); // 에러 메시지 표시
            console.error(errorMessage, error.response.data);
        } else if (error.request) {
            // 네트워크 오류 처리
            const errorMessage = '네트워크 연결에 문제가 발생했습니다.';
            alert(errorMessage);
            console.error(errorMessage, error.request);
        } else {
            // 기타 오류 처리
            const errorMessage = '오류가 발생했습니다.';
            alert(errorMessage);
            console.error(errorMessage, error.message);
        }
        return Promise.reject(error);
    }
);

const getErrorMessage = (errorResponse) => {
    if (errorResponse.data && errorResponse.data.message) {
        return errorResponse.data.message;
    } else {
        switch (errorResponse.status) {
            case 400: return '잘못된 요청입니다.';
            case 403: return '권한이 없습니다.';
            case 404: return '페이지를 찾을 수 없습니다.';
            case 409: return '이미 신고된 유저입니다.'
            case 500: return '서버 오류가 발생했습니다.';
            default: return '알 수 없는 오류가 발생했습니다.';
        }
    }
};

export default instance;
