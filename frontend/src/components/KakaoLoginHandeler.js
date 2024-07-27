import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const KakaoLoginHandler = () => {
    const navigate = useNavigate();
    const code = new URL(window.location.href).searchParams.get("code");

    useEffect(() => {
        const kakaoLogin = async () => {
            try {
                console.log("Received authorization code:", code); // 디버깅 로그

                const response = await axios({
                    method: "POST",
                    url: `${process.env.REACT_APP_BACKEND_URL}/kakao/callback`, // 백엔드 서버의 올바른 URL
                    data: { code },
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                });

                console.log("Response from backend:", response.data); // 디버깅 로그

                // 필요한 정보를 localStorage에 저장
                localStorage.setItem("name", response.data.account.kakaoName);

                // 메인 페이지로 이동
                navigate("/Search/SearchAll");
            } catch (error) {
                console.error("Login failed:", error);
                // 에러가 발생하면 에러 페이지로 이동하거나 메시지를 표시
            }
        };

        if (code) {
            kakaoLogin();
        }
    }, [code, navigate]);

    return null; // 화면에 아무것도 렌더링하지 않음
};

export default KakaoLoginHandler;
