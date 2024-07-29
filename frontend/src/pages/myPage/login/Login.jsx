import React from 'react';
import kakaoImage from '../../../assets/images/kakao_login_medium_narrow.png';
import googleImage from '../../../assets/images/google_login.png';

function Login() {
    const CLIENT_KAKAO_ID = process.env.REACT_APP_REST_API_KEY;
    const REDIRECT_KAKAO_URI = process.env.REACT_APP_REDIRECT_URL;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_KAKAO_ID}&redirect_uri=${REDIRECT_KAKAO_URI}&response_type=code`;

    const CLIENT_GOOGLE_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const REDIRECT_GOOGLE_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_GOOGLE_ID}&redirect_uri=${REDIRECT_GOOGLE_URI}&response_type=code&scope=profile%20email&access_type=offline&include_granted_scopes=true`;

    return (
        <div>
            <h1>로그인 페이지</h1>
            <a href={KAKAO_AUTH_URL} className="kakaobtn">
                <img src={kakaoImage} alt="Kakao Login"/>
            </a>
            <a href={GOOGLE_AUTH_URL} className="googlebtn">
                <img src={googleImage} alt="Google Login"/>
            </a>
        </div>
    );
}

export default Login;
