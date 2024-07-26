import React from 'react';
import {useNavigate} from 'react-router-dom';

function PointGameMain() {
    const navigate = useNavigate();

    const moveGacha = () => {
        navigate('/GachaGame');
    }

    return(
        <>
            <button className="gacha-button" onClick={moveGacha}>가챠 게임</button>
        </>
    );
}

export default PointGameMain;