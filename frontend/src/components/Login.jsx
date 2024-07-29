import React from 'react';
//import axios from 'axios';

function Login() {
    const CLIENT_ID = process.env.REACT_APP_REST_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URL;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`; // 템플릿 리터럴 사용

    return (
        <div>
            <h1>로그인 페이지</h1>
            <a href={KAKAO_AUTH_URL} className="kakaobtn">
                <img src={process.env.PUBLIC_URL + '/assets/Kakao.png'} alt="Kakao Login" />
            </a>
        </div>
    );
}

export default Login;
