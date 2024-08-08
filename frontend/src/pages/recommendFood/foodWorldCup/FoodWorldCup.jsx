import React from 'react';
import {ArrowLeftLong, ArrowRightLong, Trophy} from "../../../components/imgcomponents/ImgComponents";
import '../../../assets/style/recommendFood/FoodWorldCup.css'
import {useLocation, useNavigate} from "react-router-dom";
import {useHeaderColorChange, useNavigateNone} from '../../../hooks/NavigateComponentHooks';

function FoodWorldCup() {
    const navigate = useNavigate();
    const location = useLocation();

    const moveRecommend = () => {
        navigate('/recommend');
    }

    const moveWorldCup = () => {
        navigate('/recommend/foodWorldCup/foodWorldCupGame')
    }

    useNavigateNone();

    return(
        <div className="worldCup-container">
            <button className="arrow-btn" onClick={moveRecommend}><ArrowLeftLong/></button>
            <div className="worldCup-content">
                <h1 className="worldCup-title">Food World Cup</h1>
                <Trophy/>
                <p className="worldCup-text">
                    월드컵은 16강으로 진행됩니다.<br/>
                    랜덤으로 음식이 나오니<br/>
                    메뉴가 고민이신 분들은<br/>
                    게임을 통해 정해보세요!
                </p>
                <button className="worldCup-btn" onClick={moveWorldCup}><span>START!</span></button>
            </div>
        </div>
    );
}

export default FoodWorldCup;