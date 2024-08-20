// src/utils/axios.js
import axios from 'axios';

// Axios 인스턴스 생성
// baseURL: API 서버의 기본 URL 설정
// withCredentials: 쿠키와 같은 인증 정보를 요청에 포함할지 여부 설정
// headers: 기본적으로 모든 요청에 대해 JSON 형식의 데이터를 전송하도록 설정
const instance = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터 설정
// 모든 요청에 대해 localStorage에 저장된 토큰이 있을 경우, 해당 토큰을 Authorization 헤더에 추가
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // 로컬스토리지에서 토큰 가져오기
    if (token) {
        console.log('Token:', token);  // 콘솔에 토큰 출력 (디버깅 용도)
        config.headers.Authorization = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
    }
    return config; // 요청 설정 완료 후 반환
},error => {
    return Promise.reject(error); // 요청 오류 처리
});

// 응답 인터셉터 설정
instance.interceptors.response.use(
    response => response, // 응답이 성공적인 경우, 그대로 반환

    // 응답이 실패한 경우 처리 (비동기)
    async error => {

        // 응답이 401 Unauthorized일 경우 (인증 오류)
        if (error.response && error.response.status === 401) {

            // 로컬스토리지에서 사용자 관련 정보 및 레시피 데이터 제거
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

            // 로그인 페이지로 리다이렉트
            window.location.href = '/myPage/login';
            alert("로그인이 필요한 서비스 입니다! 로그인 페이지로 이동됩니다.");

            return Promise.reject({ ...error, redirectTo: '/myPage/login' }); // 오류 객체에 redirectTo 정보를 추가
        } else if (error.response) {
            // 서버에서 발생한 4xx, 5xx 에러 처리
            const errorMessage = getErrorMessage(error.response); // 사용자에게 보여줄 에러 메시지를 얻음
            alert(errorMessage); // 에러 메시지를 알림으로 표시
            window.location.href ="/";
            console.error(errorMessage, error.response.data); // 에러 메시지와 응답 데이터를 콘솔에 출력
        } else if (error.request) {
            // 요청이 전송되었으나 응답을 받지 못한 경우 (네트워크 문제)
            const errorMessage = '네트워크 연결에 문제가 발생했습니다.';
            alert(errorMessage); // 사용자에게 네트워크 문제 알림
            console.error(errorMessage, error.request);  // 네트워크 오류를 콘솔에 출력
        } else {
            // 그 외 오류 처리 (예: 요청 생성 중 오류 발생)
            const errorMessage = '오류가 발생했습니다.';
            alert(errorMessage); // 사용자에게 오류 메시지 알림
            console.error(errorMessage, error.message);  // 오류 메시지를 콘솔에 출력
        }
        return Promise.reject(error); // 오류를 다시 던짐
    }
);

// 에러 응답 메시지를 생성하는 함수
// 서버로부터 받은 응답 데이터에 메시지가 있으면 해당 메시지를 반환하고, 없을 경우 상태 코드에 따라 기본 메시지를 반환
const getErrorMessage = (errorResponse) => {
    if (errorResponse.data && errorResponse.data.message) {
        return errorResponse.data.message; // 서버로부터 제공된 에러 메시지 반환
    } else {
        // 상태 코드에 따른 기본 에러 메시지 설정
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

export default instance; // 설정된 Axios 인스턴스 내보내기
