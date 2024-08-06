import React, {useState, useEffect} from 'react';
import {CSSTransition} from 'react-transition-group';
import '../../css/Quiz/Timer.css';

const TimerBar = ({time, onTimeout}) => {
    const [timeLeft, setTimeLeft] = useState(time);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const percentage = (timeLeft / time) * 100;

    useEffect(() => {
        if (percentage === 0) {
            onTimeout();
        }
    }, [percentage])

    return (
        <div className="timer-container">
            <CSSTransition in={timeLeft > 0} timeout={1000} classNames="timer-bar" unmountOnExit>
                <div className="timer-bar" style={{width: `${percentage}%`}}/>
            </CSSTransition>
        </div>
    );
};

export default TimerBar;