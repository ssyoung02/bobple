import React, { useState, useRef, useEffect } from 'react';
import '../../../../assets/style/SlotMachine.css';

function SlotMachine() {
    const [numKeepTrack, setNumKeepTrack] = useState(0);
    const [isSpinning, setIsSpinning] = useState([false, false, false]);
    const symbols = ['🍒', '🍋', '🍊', '🍉'];

    const handleStart = () => {
        setNumKeepTrack(3);
        setIsSpinning([true, true, true]);
    };

    const handleStop = () => {
        if (numKeepTrack > 0) {
            const newSpinningState = [...isSpinning];
            newSpinningState[3 - numKeepTrack] = false;
            setIsSpinning(newSpinningState);
            setNumKeepTrack(numKeepTrack - 1);
        }
    };

    return (
        <div id="example10">
            {isSpinning.map((spinning, index) => (
                <div key={index} className="slot">
                    <div className={`slot-inner ${spinning ? 'scroll' : ''}`}>
                        {symbols.concat(symbols, symbols).map((item, idx) => (
                            <div key={idx}>{item}</div>
                        ))}
                    </div>
                </div>
            ))}
            <button id="btn-example10-start" onClick={handleStart}>Start</button>
            <button id="btn-example10-stop" onClick={handleStop}>Stop</button>
        </div>
    );
}

export default SlotMachine;
