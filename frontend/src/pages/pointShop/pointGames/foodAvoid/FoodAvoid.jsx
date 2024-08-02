import React, { useState, useEffect, useRef } from "react";
import '../../../../assets/style/pointGame/avoid/FoodAvoid.css';

const CANVAS_WIDTH = 800; // 캔버스 너비 설정
const CANVAS_HEIGHT = 600; // 캔버스 높이 설정
const CHAR_SIZE = 50; // 캐릭터 크기
const BALL_RADIUS = 10; // 공의 반지름
const CHAR_SPEED = 50; // 캐릭터 이동 속도(ms)
const CREAT_BALL_SECOND = 1000; // 공 생성 주기(ms)
const MOBILE_CHAR_MOVE = 15; // 모바일 캐릭터 이동 거리
const USER = "../../../assets/images/icon/bobple_mascot.png"; // 사용자 이미지 경로

const DIRECTIONS = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    STOP: "STOP",
};

const FoodAvoid = () => {
    const [balls, setBalls] = useState([]);
    const [position, setPosition] = useState({ x: CANVAS_WIDTH / 2 - 15, y: CANVAS_HEIGHT - CHAR_SIZE });
    const [direction, setDirection] = useState(DIRECTIONS.STOP);
    const [coordinate, setCoordinate] = useState({ x: Math.random() * CANVAS_WIDTH, y: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [score, setScore] = useState(0);
    const [scoreOn, setScoreOn] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [gameOn, setGameOn] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const canvasRef = useRef(null);
    const charRef = useRef(new Image());

    useEffect(() => {
        if (gameStart) {
            const createBall = () => {
                const speed = (Math.floor(Math.random() * 5) + 1) * 50;
                const newBall = {
                    id: Date.now(),
                    x: coordinate.x,
                    y: -20,
                    speed: speed,
                };
                setBalls((prevBalls) => [...prevBalls, newBall]);
            };

            const moveBalls = () => {
                setBalls((prevBalls) =>
                    prevBalls.map((ball) => ({
                        ...ball,
                        y: ball.y + ball.speed,
                    }))
                );
            };

            const intervalId = setInterval(createBall, CREAT_BALL_SECOND);
            const animationId = requestAnimationFrame(moveBalls);

            return () => {
                clearInterval(intervalId);
                cancelAnimationFrame(animationId);
            };
        }
    }, [gameStart, coordinate]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            balls.forEach((ball) => {
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = "#FFE650";
                ctx.fill();
                ctx.closePath();
            });
        }
    }, [balls]);

    useEffect(() => {
        const handleKeyDown = (e) => {
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
                    setDirection(DIRECTIONS.STOP);
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const moveChar = () => {
            let newX = position.x;
            switch (direction) {
                case DIRECTIONS.LEFT:
                    newX = Math.max(newX - 5, 0);
                    break;
                case DIRECTIONS.RIGHT:
                    newX = Math.min(newX + 5, CANVAS_WIDTH - CHAR_SIZE);
                    break;
                default:
                    break;
            }
            setPosition({ x: newX, y: position.y });
        };

        const intervalId = setInterval(moveChar, CHAR_SPEED);
        return () => clearInterval(intervalId);
    }, [direction, position]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            const char = charRef.current;
            if (imageLoaded) {
                ctx.drawImage(char, position.x, position.y, CHAR_SIZE, CHAR_SIZE);
            }
            char.onload = () => setImageLoaded(true);
            char.src = USER;
            return () => (char.onload = null);
        }
    }, [position, imageLoaded]);

    useEffect(() => {
        const RandomCoordinate = () => {
            const newCoordinate = {
                x: Math.random() * CANVAS_WIDTH,
                y: 0,
            };
            setCoordinate(newCoordinate);
        };

        const intervalId = setInterval(RandomCoordinate, CREAT_BALL_SECOND);
        return () => clearInterval(intervalId);
    }, []);

    const resetGame = () => {
        setScore(0);
        setGameStart(false);
        setScoreOn(false); // 점수 증가 정지
        setGameOn(false);
        setOpenDialog(false); // 게임 오버 상태 초기화

        // 캐릭터 위치 초기화
        setPosition({
            x: CANVAS_WIDTH / 2 - 15,
            y: CANVAS_HEIGHT - CHAR_SIZE,
        });

        // 공 초기화
        setBalls([]);
    };

    const calculateDistance = (ballX, ballY, charX, charY) => {
        const dx = ballX - charX;
        const dy = ballY - charY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const checkCollisionWithChar = () => {
        balls.forEach((ball) => {
            const distance = calculateDistance(
                ball.x,
                ball.y,
                position.x + CHAR_SIZE / 2,
                position.y
            );
            if (distance <= CHAR_SIZE / 2) {
                setOpenDialog(true);
                setGameStart(false);
                setScoreOn(false);
                setGameOn(false);
            }
        });
    };

    useEffect(() => {
        if (gameStart) {
            const intervalId = setInterval(checkCollisionWithChar, 100);
            return () => clearInterval(intervalId);
        }
    }, [gameStart, balls, position]);

    useEffect(() => {
        if (scoreOn) {
            const intervalId = setInterval(() => {
                setScore((prevCount) => prevCount + 1);
            }, 100);
            return () => clearInterval(intervalId);
        }
    }, [scoreOn]);

    const handleGameStart = () => {
        setGameOn(true);
        setGameStart(true);
        setScoreOn(true);
    };

    const moveCharRight = () => {
        let newX = position.x;
        newX = Math.min(newX + MOBILE_CHAR_MOVE, CANVAS_WIDTH - CHAR_SIZE);
        setPosition({ x: newX, y: position.y });
    };

    const moveCharLeft = () => {
        let newX = position.x;
        newX = Math.max(newX - MOBILE_CHAR_MOVE, 0);
        setPosition({ x: newX, y: position.y });
    };

    return (
        <div className="container">
            <canvas className="canvas" ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
            <button className="button" onClick={handleGameStart}>Start Game</button>
            <button className="button" onClick={resetGame}>Reset Game</button>
            <div>
                <button className="button" onClick={moveCharLeft}>Left</button>
                <button className="button" onClick={moveCharRight}>Right</button>
            </div>
            {openDialog && <div className="dialog">Game Over!</div>}
            <div className="score">Score: {score}</div>
        </div>
    );
};

export default FoodAvoid;
