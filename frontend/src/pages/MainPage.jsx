import React, {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import '../assets/style/MainPage.css'
import SliderComponent from "../components/SliderComponent";
import { clearRecipeLocalStorage } from '../utils/localStorageUtils';
import {AiLunch, CalculatorBanner, Meeting, NextTo, RandomMenu} from "../components/imgcomponents/ImgComponents";
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
        clearRecipeLocalStorage();
        navigate('/mainGame');
    };

    const moveCalculator = () => {
        clearRecipeLocalStorage();
        navigate('/myPage/calculator');
    };

    const moveRecipeAI = () => {
        clearRecipeLocalStorage();
        navigate('/recipe/ai-recommendation'); // 경로 복원
    }
    const moveGroup = () => {
        clearRecipeLocalStorage();
        navigate('/group');
    };

    const moveRecommend = () => {
        clearRecipeLocalStorage();
        navigate('/recommend/');
    };

    return (
        <div className="mainPage">
            <SliderComponent/>
            <div className={"shortMenu"}>
                <button className={"shortMenuItem"} onClick={moveCalculator}>
                    <div className={"shortMenuIcon"}><CalculatorBanner/></div>
                    <p className={"shortMenuName"}>1/N</p>
                </button>
                <button className={"shortMenuItem"} onClick={moveRecipeAI}>
                    <div className={"shortMenuIcon"}><AiLunch/></div>
                    <p className={"shortMenuName"}>AI 도시락</p>
                </button>
                <button className={"shortMenuItem"} onClick={moveGroup}>
                    <div className={"shortMenuIcon"}><Meeting/></div>
                    <p className={"shortMenuName"}>번개모임</p>
                </button>
                <button className={"shortMenuItem"} onClick={moveRecommend}>
                    <div className={"shortMenuIcon"}><RandomMenu/></div>
                    <p className={"shortMenuName"}>랜덤메뉴</p>
                </button>
            </div>
            <div className="summation-box">
                <div className="summation-top">
                    <div className="summation-left">
                        <sapn className="summation-title">
                            가까운 매장
                        </sapn>
                        <h3>
                            {user && (<>{user.name}님</>)} 근처 맛집
                        </h3>
                    </div>
                    <button className="summation-more">더보기 <NextTo/></button>
                </div>
                <div className="summation-content">

                </div>
            </div>
            <div className="summation-box">
                <div className="summation-top">
                    <div className="summation-left">
                        <sapn className="summation-title">
                            BEST 레시피
                        </sapn>
                        <h3>
                            오늘의 도시락
                        </h3>
                    </div>
                    <button className="summation-more">더보기 <NextTo/></button>
                </div>
                <div className="summation-content">

                </div>
            </div>

        </div>
    );
}

export default MainPage;
