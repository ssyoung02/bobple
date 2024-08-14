import React from 'react';
import '../../../../assets/style/pointGame/gacha/Machine.scss';
import GachaMachine from "../../../../assets/images/white-gotcha.svg";
import GachaHandle from "../../../../assets/images/handle.svg";
import {useNavigate} from "react-router-dom";

const Machine = () => {

    const navigate = useNavigate();

    const moveBack = () => {
        navigate('/point')
    }

    return (
        <>
            <div className="game-layer">
                <button className="gacha-back-btn" onClick={moveBack}>⬅️</button>
                <div className="machine-container">
                    <div className="backboard"></div>
                    <div className="balls"></div>
                    <img className="machine" src={GachaMachine} alt="Machine"/>
                    <div className="title"></div>
                    <div className="price"></div>
                    <img className="handle" src={GachaHandle} alt="Handle"/>
                    <div className="pointer"></div>
                </div>
            </div>
        </>
    );
}

export default Machine;
