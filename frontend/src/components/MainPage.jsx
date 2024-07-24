import React from "react";
import {useNavigate} from 'react-router-dom';
import '../css/MainPage.css'

function MainPage() {
    const navigate = useNavigate();

    const moveRecipe = () => {
        navigate('/Recipe');
    }

    const moveRecommend = () => {
        navigate('/RecommendFood');
    }

    const moveAround = () => {
        navigate('/Recipe');
    }

    const moveGroup = () => {
        navigate('/RecommendFood');
    }

    const moveMyinfo = () => {
        navigate('/Recipe');
    }

    const movePoint = () => {
        navigate('/RecommendFood');
    }

    return (
        <div className="footer-buttons">
            <button className="recipe-button footer-btn" onClick={moveRecipe}>레시피</button>
            <button className="recommend-button footer-btn" onClick={moveRecommend}>맛집추천</button>
            <button className="around-button footer-btn" onClick={moveAround}>주변맛집</button>
            <button className="group-button footer-btn" onClick={moveGroup}>함께먹기</button>
            <button className="myinfo-button footer-btn" onClick={moveMyinfo}>내정보</button>
            <button className="point-button footer-btn" onClick={movePoint}>포인트샵</button>
        </div>
    )
}

export default MainPage;