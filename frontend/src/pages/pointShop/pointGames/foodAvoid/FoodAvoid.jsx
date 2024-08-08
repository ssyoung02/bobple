import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom'; // React Router useNavigate import
import '../../../../assets/style/pointGame/avoid/FoodAvoid.css';
import bobpleMascot from '../../../../assets/images/bobple_mascot.png'; // 이미지 import

const CANVAS_WIDTH = 800; // 캔버스 너비 설정
const CANVAS_HEIGHT = 600; // 캔버스 높이 설정
const CHAR_SIZE = 60; // 캐릭터 크기
const BALL_RADIUS = 10; // 공의 반지름
const CHAR_SPEED = 10; // 캐릭터 이동 속도(ms)
const CREATE_BALL_INTERVAL = 200; // 공 생성 주기(ms)
const MOBILE_CHAR_MOVE = 15; // 모바일 캐릭터 이동 거리
const USER = bobpleMascot; // 캐릭터 이미지의 경로

const DIRECTIONS = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    STOP: "STOP",
};

const FoodAvoid = () => {
    const [balls, setBalls] = useState([]);
    const [position, setPosition] = useState({ x: CANVAS_WIDTH / 2 - 15, y: CANVAS_HEIGHT - CHAR_SIZE });
    const [direction, setDirection] = useState(DIRECTIONS.STOP);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [score, setScore] = useState(0);
    const [scoreOn, setScoreOn] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const canvasRef = useRef(null);
    const charRef = useRef(new Image());
    const navigate = useNavigate(); // useNavigate 훅 사용
    const moveRef = useRef(); // moveChar 함수 참조를 위해 useRef 사용

    useEffect(() => {
        if (gameStart) {
            const createBall = () => {
                const newBalls = Array.from({ length: 3 }, () => ({
                    id: Date.now() + Math.random(),
                    x: Math.random() * CANVAS_WIDTH,
                    y: -BALL_RADIUS,
                    speed: (Math.floor(Math.random() * 5) + 1) * 2 // 공의 속도 (마지막 숫자만 변경)
                }));
                setBalls((prevBalls) => [...prevBalls, ...newBalls]);
            };

            const intervalId = setInterval(createBall, CREATE_BALL_INTERVAL);

            return () => clearInterval(intervalId);
        }
    }, [gameStart]);

    useEffect(() => {
        if (gameStart) {
            const moveBalls = () => {
                setBalls((prevBalls) =>
                    prevBalls.map((ball) => ({
                        ...ball,
                        y: ball.y + ball.speed
                    })).filter(ball => ball.y < CANVAS_HEIGHT)
                );
                checkCollisionWithChar();
            };

            const animationId = requestAnimationFrame(moveBalls);

            return () => cancelAnimationFrame(animationId);
        }
    }, [balls, gameStart]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            balls.forEach((ball) => {
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = "#FFE650";
                ctx.fill();
                ctx.closePath();
            });

            if (imageLoaded) {
                const char = charRef.current;
                ctx.drawImage(char, position.x, position.y, CHAR_SIZE, CHAR_SIZE);
            }
        }
    }, [balls, position, imageLoaded]);

    const handleKeyDown = (e) => {
        if (gameStart) {
            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();
                    setDirection(DIRECTIONS.LEFT);
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    setDirection(DIRECTIONS.RIGHT);
                    break;
                default:
                    break;
            }
        }
    };

    const handleKeyUp = (e) => {
        if (gameStart) {
            switch (e.key) {
                case "ArrowLeft":
                case "ArrowRight":
                    setDirection(DIRECTIONS.STOP);
                    break;
                default:
                    break;
            }
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [gameStart]);

    useEffect(() => {
        const moveChar = () => {
            let newX = position.x;
            switch (direction) {
                case DIRECTIONS.LEFT:
                    newX = Math.max(newX - CHAR_SPEED, 0);
                    break;
                case DIRECTIONS.RIGHT:
                    newX = Math.min(newX + CHAR_SPEED, CANVAS_WIDTH - CHAR_SIZE);
                    break;
                default:
                    break;
            }
            setPosition({ x: newX, y: position.y });
            moveRef.current = requestAnimationFrame(moveChar);
        };

        if (gameStart && direction !== DIRECTIONS.STOP) {
            moveRef.current = requestAnimationFrame(moveChar);
        }

        return () => cancelAnimationFrame(moveRef.current);
    }, [direction, position, gameStart]);

    useEffect(() => {
        const char = charRef.current;
        char.onload = () => {
            setImageLoaded(true);
        };
        char.onerror = () => {
            console.error("캐릭터 이미지 로드 실패");
        };
        char.src = USER;
    }, []);

    const resetGame = () => {
        setScore(0);
        setGameStart(false);
        setScoreOn(false);
        setOpenDialog(false);
        setPosition({
            x: CANVAS_WIDTH / 2 - 15,
            y: CANVAS_HEIGHT - CHAR_SIZE,
        });
        setBalls([]);
    };

    const calculateDistance = (ballX, ballY, charX, charY) => {
        const dx = ballX - charX;
        const dy = ballY - charY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const checkCollisionWithChar = () => {
        const charCenterX = position.x + CHAR_SIZE / 2;
        const charCenterY = position.y + CHAR_SIZE / 2;

        for (let ball of balls) {
            const distance = calculateDistance(ball.x, ball.y, charCenterX, charCenterY);
            if (distance < BALL_RADIUS + CHAR_SIZE / 2 - 1) {
                setOpenDialog(true);
                setGameStart(false);
                setScoreOn(false);
                return;
            }
        }
    };

    useEffect(() => {
        if (scoreOn) {
            const intervalId = setInterval(() => {
                setScore((prevCount) => prevCount + 1);
            }, 100);
            return () => clearInterval(intervalId);
        }
    }, [scoreOn]);

    const handleGameStart = () => {
        setGameStart(true);
        setScoreOn(true);
    };

    const handleExit = () => {
        navigate('/point/pointGame'); // 이전 페이지로 이동
    };

    const moveCharRight = () => {
        if (gameStart) {
            let newX = position.x;
            newX = Math.min(newX + MOBILE_CHAR_MOVE, CANVAS_WIDTH - CHAR_SIZE);
            setPosition({ x: newX, y: position.y });
        }
    };

    const moveCharLeft = () => {
        if (gameStart) {
            let newX = position.x;
            newX = Math.max(newX - MOBILE_CHAR_MOVE, 0);
            setPosition({ x: newX, y: position.y });
        }
    };

    return (
        <div className="avoid-body">
            <div className="avoid-container">
                <canvas className="avoid-canvas" ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
                {!gameStart && !openDialog && (
                    <button className="avoid-button center-button" onClick={handleGameStart}>
                        Start Game
                    </button>
                )}
                {openDialog && (
                    <button className="avoid-button center-button" onClick={handleExit}>
                        Exit
                    </button>
                )}
                <div className="button-container">
                    <button className="avoid-button" onClick={moveCharLeft} disabled={!gameStart}>Left</button>
                    <button className="avoid-button" onClick={moveCharRight} disabled={!gameStart}>Right</button>
                </div>
                {openDialog && <div className="avoid-dialog">Game Over!</div>}
                <div className="avoid-score">Score: {score}</div>
            </div>
        </div>
    );
};

export default FoodAvoid;
