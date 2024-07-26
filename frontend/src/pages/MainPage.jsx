import React from "react";
import {useNavigate} from 'react-router-dom';
import '../assets/style/MainPage.css'
import Modal from "../components/modal/Modal";

function MainPage() {
    const navigate = useNavigate();

    const moveRecipe = () => {
        navigate('/recipe');
    }

    const moveRecommend = () => {
        navigate('/recommend');
    }

    const moveAround = () => {
        navigate('/around');
    }

    const moveGroup = () => {
        navigate('/group');
    }

    const moveMyPage = () => {
        navigate('/myPage');
    }

    const movePoint = () => {
        navigate('/point');
    }

    const moveAdmin = () => {
        navigate('/admin/notice');
    }

    const moveMainGame = () => {
        navigate('/mainGame');
    }

    return (
        <div className="footer-buttons">
            <button className="recipe-button footer-btn" onClick={moveRecipe}>레시피</button>
            <button className="recommend-button footer-btn" onClick={moveRecommend}>맛집추천</button>
            <button className="around-button footer-btn" onClick={moveAround}>주변맛집</button>
            <button className="group-button footer-btn" onClick={moveGroup}>함께먹기</button>
            <button className="myinfo-button footer-btn" onClick={moveMyPage}>내정보</button>
            <button className="point-button footer-btn" onClick={movePoint}>포인트샵</button>
            <button className="mainGame-button footer-btn" onClick={moveMainGame}>메인게임</button>
            <button className="admin-button footer-btn" onClick={moveAdmin}>관리자</button>
            <Modal/>
        </div>
    )
}

export default MainPage;