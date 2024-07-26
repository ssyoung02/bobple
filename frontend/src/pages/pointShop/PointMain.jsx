import React from 'react';
import {useNavigate} from 'react-router-dom';

function PointMain() {
    const navigate = useNavigate();

    const moveGame = () => {
        navigate('/point/pointGame');
    }

    return(
        <div>
            <button className="game-button" onClick={moveGame}>게임</button>
        </div>
    );
}

export default PointMain;