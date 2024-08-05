import React from 'react';
import {useNavigate} from "react-router-dom";
import '../../../assets/style/myPage/Login.css';
import {Google, KLogin, NLogin} from "../../../components/imgcomponents/ImgComponents";
import {Link} from "react-router-dom";

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

    const navigate = useNavigate();

    const moveAdmin = () => {
        navigate('/myPage/login/admin');
    }

    return (
        <div className="login-main">
            <div className="login-buttons">
                <h2>Login</h2>
                <div className={"user-login-buttons"}>
                    <a href={KAKAO_AUTH_URL} className="kakaobtn">
                        <KLogin/>
                        Kakao 로그인
                    </a>
                    <a href={GOOGLE_AUTH_URL} className="googlebtn">
                        <Google/>
                        Google 로그인
                    </a>
                    <a href={NAVER_AUTH_URL} className="naverbtn">
                        <NLogin/>
                        Naver 로그인
                    </a>

                </div>
                {/*<div className="admin-login-buotton">*/}
                {/*    <div className="admin-line">*/}
                {/*        <div className="backline"></div>*/}
                {/*        <h6>관리자 로그인</h6>*/}
                {/*        <div className="backline"></div>*/}
                {/*    </div>*/}
                {/*    <button>*/}
                {/*        관리자 로그인*/}
                {/*    </button>*/}
                {/*    <div className="admin-login-box">*/}
                {/*        <label>아이디</label>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}

export default Login;