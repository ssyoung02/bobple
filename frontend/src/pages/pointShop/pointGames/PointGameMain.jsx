import React from 'react';
import {useNavigate} from 'react-router-dom';

function PointGameMain() {
    const navigate = useNavigate();

    const moveGacha = () => {
        navigate('/point/pointGame/GachaGame');
    }

    return(
        <div>
            <button className="gacha-button" onClick={moveGacha}>가챠 게임</button>
        </div>
    );
}

export default PointGameMain;