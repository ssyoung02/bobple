import React from "react";
import {Link, useNavigate} from 'react-router-dom';
import '../assets/style/MainPage.css'
import SliderComponent from "../components/SliderComponent";

function MainPage() {
    const navigate = useNavigate();

    const moveGame = () => {
        navigate('/mainGame');
    }

    const moveCalculator = () => {
        navigate('/myPage/calculator');
    }
    const moveRecipeAI = () => {
        navigate('/recipe/ai-recommendation'); // 경로 복원
    }
    const moveGroup = () => {
        navigate('/group');
    }
    const moveRecommend = () => {
        navigate('/recommend/');
    }

    return (
        <div>
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
                    <div className={"MenuImage"}>

                    </div>
                    <div className={"MenuExplanation"}>
                        <h4>메뉴가 고민되면</h4>
                        <p>지금 메뉴를 정하지 못했다면 주변 맛집을 확인해보세요!</p>
                        <p className={"GoToMenu"}>주변맛집 바로가기 ></p>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default MainPage;