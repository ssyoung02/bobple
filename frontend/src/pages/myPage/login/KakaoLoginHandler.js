import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const KakaoLoginHandler = () => {
    const navigate = useNavigate();
    const code = new URL(window.location.href).searchParams.get("code");

    useEffect(() => {
        const kakaoLogin = async () => {
            try {
                console.log('Kakao Backend URL:', process.env.REACT_APP_KAKAO_BACKEND_URL);  // Debugging line
                const res = await axios({
                    method: "GET",
                    url: `${process.env.REACT_APP_KAKAO_BACKEND_URL}?code=${code}`,
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                });

                // 백엔드에서 받은 데이터 처리
                console.log(res);
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userIdx", res.data.user_idx);
                localStorage.setItem("name", res.data.username);
                localStorage.setItem("email", res.data.email);
                localStorage.setItem("token", res.data.token);

                // 로그인이 성공하면 메인 페이지로 이동
                navigate("/");
            } catch (error) {
                console.error("로그인 중 오류 발생: ", error);
                console.error("응답 데이터: ", error.response ? error.response.data : 'No response data');
                console.error("응답 상태 코드: ", error.response ? error.response.status : 'No response status');
            }

        };

        if (code) {
            kakaoLogin();
        }
    }, [code, navigate]);

    return null;
};

export default KakaoLoginHandler;
