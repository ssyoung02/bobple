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
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// TODO: 실제 백엔드 API 엔드포인트에 맞게 수정
const refreshToken = async () => {
    try {
        const response = await axios.post('/auth/refresh');
        return response.data.token;
    } catch (error) {
        localStorage.removeItem('token');
        window.location.href = '/myPage/login/login';
        throw error;
    }
};

instance.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            try {
                const newToken = await refreshToken();
                localStorage.setItem('token', newToken);

                error.config.headers.Authorization = `Bearer ${newToken}`;
                return axios(error.config);
            } catch (refreshError) {
                console.error('토큰 갱신 실패:', refreshError);
                localStorage.removeItem('token');
                return Promise.reject({ ...error, redirectTo: '/myPage/login/login' });
            }
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
            case 500: return '서버 오류가 발생했습니다.';
            default: return '알 수 없는 오류가 발생했습니다.';
        }
    }
};

// // 요청 인터셉터 (토큰 설정)
// instance.interceptors.request.use(config => {
//     const token = localStorage.getItem('token');
//     console.log(token);
//     // if (token && !config.url.includes('/api/recipes/search')) { // 인증이 필요 없는 엔드포인트를 제외합니다.
//     //     config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
// });
//
// // 응답 인터셉터
// instance.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response && error.response.status === 401) {
//             // 401 에러 처리 (예: 로그아웃 처리)
//             localStorage.removeItem('token');
//             window.location.href = '/myPage/login/login'; // 로그인 페이지로 리디렉션
//         }
//         return Promise.reject(error);
//     }
// );

export default instance;
