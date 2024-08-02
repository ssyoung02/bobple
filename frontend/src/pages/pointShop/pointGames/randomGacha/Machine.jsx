import React from 'react';
import '../../../../assets/style/pointGame/gacha/Machine.scss';

const Machine = () => {
    return (
        <div className="game-layer">
            <div className="machine-container">
                <div className="backboard"></div>
                <div className="balls"></div>
                <img className="machine" src="https://assets.codepen.io/2509128/gotcha.svg" alt="Machine" />
                <div className="title"></div>
                <div className="price"></div>
                <img className="handle" src="https://assets.codepen.io/2509128/handle.svg" alt="Handle" />
                <div className="pointer">
                    <img src="https://assets.codepen.io/2509128/point.png" alt="Pointer" />
                </div>
            </div>
        </div>
    );
}

export default Machine;
