import React from 'react';
import kakaoImage from '../../../assets/images/kakao_login_medium_narrow.png';
import googleImage from '../../../assets/images/google_login.png';
import naverImage from '../../../assets/images/naver_login.png';

function Login() {
    const CLIENT_KAKAO_ID = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const REDIRECT_KAKAO_URI = process.env.REACT_APP_KAKAO_REDIRECT_URL;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_KAKAO_ID}&redirect_uri=${REDIRECT_KAKAO_URI}&response_type=code`;

    const CLIENT_GOOGLE_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const REDIRECT_GOOGLE_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URL;
    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_GOOGLE_ID}&redirect_uri=${REDIRECT_GOOGLE_URI}&response_type=code&scope=profile%20email&access_type=offline&include_granted_scopes=true`;

    const CLIENT_NAVER_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
    const REDIRECT_NAVER_URI = process.env.REACT_APP_NAVER_REDIRECT_URL;
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?client_id=${CLIENT_NAVER_ID}&redirect_uri=${REDIRECT_NAVER_URI}&response_type=code`;

    return (
        <div>
            <h1>로그인 페이지</h1>
            <a href={KAKAO_AUTH_URL} className="kakaobtn">
                <img src={kakaoImage} alt="Kakao Login"/>
            </a>
            <a href={GOOGLE_AUTH_URL} className="googlebtn">
                <img src={googleImage} alt="Google Login"/>
            </a>
            <a href={NAVER_AUTH_URL} className="naverbtn">
                <img src={naverImage} alt="Naver Login"/>
            </a>
        </div>
    );
}

export default Login;