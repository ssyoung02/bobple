import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import '../assets/style/MainPage.css';
import Modal from "../components/modal/Modal";
import Header from "../components/navigate/Header";
import NavBar from "../components/navigate/NavBar";
import Layout from "../components/layout/Layout";
import SliderComponent from "../components/SliderComponent";

function MainPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = {
            username: localStorage.getItem("username"),
            email: localStorage.getItem("email"),
            name: localStorage.getItem("name"),
            profileImage: localStorage.getItem("profileImage"),
            provider: localStorage.getItem("provider"),
            companyId: localStorage.getItem("companyId"),
            reportCount: localStorage.getItem("reportCount"),
            point: localStorage.getItem("point"),
            token: localStorage.getItem("token")
        };

        if (userData.token) {
            setUser(userData);
        }
    }, []);

    const moveGame = () => {
        navigate('/mainGame');
    };

    const moveCalculator = () => {
        navigate('/myPage/calculator');
    };

    const moveRecipeAI = () => {
        navigate('/recipe/recipeAi');
    };

    const moveGroup = () => {
        navigate('/group');
    };

    const moveRecommend = () => {
        navigate('/recommend/');
    };

    return (
        <>
            {user && (
                <div>
                    <p>환영합니다, {user.name}님!</p>
                    <p>이메일: {user.email}</p>
                </div>
            )}
            <h2>오늘의 주인공</h2>
            <div className={"goToGame"}>
                <div className={"gameLayer"}>
                    <button className={"mainGameContent"} onClick={moveGame}>
                        <span className={"mainGameTitle"}>제비뽑기</span>
                    </button>
                    <button className={"mainGameContent"} onClick={moveGame}>
                        <span className={"mainGameTitle"}>초성퀴즈</span>
                    </button>
                </div>
                <div className={"gameLayer"}>
                    <button className={"mainGameContent"} onClick={moveGame}>
                        <span className={"mainGameTitle"}>제비뽑기</span>
                    </button>
                    <button className={"mainGameContent"} onClick={moveGame}>
                        <span className={"mainGameTitle"}>초성퀴즈</span>
                    </button>
                </div>
                <div className={"gameLayer"}>
                    <button className={"mainGameContent"} onClick={moveGame}>
                        <span className={"mainGameTitle"}>제비뽑기</span>
                    </button>
                    <button className={"mainGameContent"} onClick={moveGame}>
                        <span className={"mainGameTitle"}>초성퀴즈</span>
                    </button>
                </div>
            </div>
            <div className={"shortMenu"}>
                <button className={"shortMenuItem"} onClick={moveCalculator}>
                    <div className={"shortMenuIcon"}></div>
                    <p className={"shortMenuName"}>1/N</p>
                </button>
                <button className={"shortMenuItem"} onClick={moveRecipeAI}>
                    <div className={"shortMenuIcon"}></div>
                    <p className={"shortMenuName"}>AI 도시락</p>
                </button>
                <button className={"shortMenuItem"} onClick={moveGroup}>
                    <div className={"shortMenuIcon"}></div>
                    <p className={"shortMenuName"}>번개모임</p>
                </button>
                <button className={"shortMenuItem"} onClick={moveRecommend}>
                    <div className={"shortMenuIcon"}></div>
                    <p className={"shortMenuName"}>랜덤메뉴</p>
                </button>
            </div>
            <SliderComponent />
            <div className={"MainRandomMenuButton"}>
                <button className={"RandomMenuButtonItem"}>
                    <div className={"MenuImage"}></div>
                    <div className={"MenuExplanation"}>
                        <h2>메뉴가 고민되면</h2>
                        <p>지금 메뉴를 정하지 못했다면 주변 맛집을 확인해보세요!</p>
                        <p className={"GoToMenu"}>주변맛집 바로가기 ></p>
                    </div>
                </button>
            </div>
        </>
    );
}

export default MainPage;
