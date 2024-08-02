import React from 'react';
import '../../../../assets/style/pointGame/gacha/Prize.scss';
import {useNavigate} from "react-router-dom";

const Prize = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        console.log('Button clicked!');
        navigate('/');
    };
    return (
        <div className="prize-container">
            <div className="prize-ball-container"></div>
            <div className="prize-reward-container">
                <div className="shine">
                    <img src="https://assets.codepen.io/2509128/shine.png" alt="Shine" />
                </div>
                <div className="prize">
                    <img className="wiggle" src="" alt="Prize" />
                </div>
                <div className="button">
                    <button className="exit-button" onClick={handleButtonClick}>돌아가기</button>
                </div>
            </div>
        </div>
    );
}

export default Prize;
