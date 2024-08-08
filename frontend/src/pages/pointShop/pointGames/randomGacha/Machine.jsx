import React from 'react';
import '../../../../assets/style/pointGame/gacha/Machine.scss';
import GachaMachine from "../../../../assets/images/white-gotcha.svg";
import GachaHandle from "../../../../assets/images/handle.svg";

const Machine = () => {
    return (
        <div className="game-layer">
            <div className="machine-container">
                <div className="backboard"></div>
                <div className="balls"></div>
                <img className="machine" src={GachaMachine} alt="Machine" />
                <div className="title"></div>
                <div className="price"></div>
                <img className="handle" src={GachaHandle} alt="Handle" />
                <div className="pointer"></div>
            </div>
        </div>
    );
}

export default Machine;
