import React, { useState, useEffect, useRef } from "react";
import {useLocation, useNavigate} from 'react-router-dom'; // React Router useNavigate import
import '../../../../assets/style/pointGame/avoid/FruitsAvoid.css';
import bobpleMascot from '../../../../assets/images/bobple_mascot.png';
import {getUserIdx} from "../../../../utils/auth"; // 이미지 import
import axios from 'axios';
import {useHeaderColorChange, useNavigateNone} from "../../../../hooks/NavigateComponentHooks";
import {ArrowLeftLong} from "../../../../components/imgcomponents/ImgComponents";

const CANVAS_WIDTH = 800; // 캔버스 너비 설정
const CANVAS_HEIGHT = 600; // 캔버스 높이 설정
const CHAR_SIZE = 60; // 캐릭터 크기
const BALL_RADIUS = 10; // 공의 반지름
const CHAR_SPEED = 10; // 캐릭터 이동 속도(ms)
const CREATE_BALL_INTERVAL = 300; // 공 생성 주기(ms)
const MOBILE_CHAR_MOVE = 15; // 모바일 캐릭터 이동 거리
const USER = bobpleMascot; // 캐릭터 이미지의 경로
const fruits = ["🍎", "🍌", "🍒", "🍇", "🍉", "🍓", "🍊", "🥝", "🍍"]; // 과일 이모티콘 배열

const DIRECTIONS = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
};

const FruitsAvoid = () => {
    const [fruitBalls, setFruitBalls] = useState([]);
    const [position, setPosition] = useState({ x: CANVAS_WIDTH / 2 - 15, y: CANVAS_HEIGHT - CHAR_SIZE });
    const [direction, setDirection] = useState(DIRECTIONS.STOP);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [score, setScore] = useState(0);
    const [scoreOn, setScoreOn] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const canvasRef = useRef(null);
    const charRef = useRef(new Image());
    const navigate = useNavigate();
    const moveRef = useRef();
    const userIdx = getUserIdx();
    const [earnedPoint, setEarnedPoint] = useState(0);
    const location = useLocation();

    useEffect(() => {
        if (gameStart) {
            const createFruit = () => {
                const newFruits = Array.from({ length: 3 }, () => ({
                    id: Date.now() + Math.random(),
                    fruit: fruits[Math.floor(Math.random() * fruits.length)], // 랜덤 과일 선택
                    x: Math.random() * CANVAS_WIDTH,
                    y: -BALL_RADIUS,
                    speed: (Math.floor(Math.random() * 5) + 1) * 2 // 과일의 속도
                }));
                setFruitBalls((prevFruits) => [...prevFruits, ...newFruits]);
            };

            const intervalId = setInterval(createFruit, CREATE_BALL_INTERVAL);

            return () => clearInterval(intervalId);
        }
    }, [gameStart]);

    useEffect(() => {
        if (gameStart) {
            const moveFruits = () => {
                setFruitBalls((prevFruits) =>
                    prevFruits.map((fruitBall) => ({
                        ...fruitBall,
                        y: fruitBall.y + fruitBall.speed
                    })).filter(fruitBall => fruitBall.y < CANVAS_HEIGHT)
                );
                checkCollisionWithChar();
            };

            const animationId = requestAnimationFrame(moveFruits);

            return () => cancelAnimationFrame(animationId);
        }
    }, [fruitBalls, gameStart]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            ctx.font = `${BALL_RADIUS * 2}px Arial`; // 이모티콘 크기 설정

            fruitBalls.forEach((fruitBall) => {
                ctx.fillText(fruitBall.fruit, fruitBall.x - BALL_RADIUS, fruitBall.y + BALL_RADIUS); // 과일 그리기
            });

            if (imageLoaded) {
                const char = charRef.current;
                ctx.drawImage(char, position.x, position.y, CHAR_SIZE, CHAR_SIZE);
            }
        }
    }, [fruitBalls, position, imageLoaded]);


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
        setFruitBalls([]);
    };

    const calculateDistance = (ballX, ballY, charX, charY) => {
        const dx = ballX - charX;
        const dy = ballY - charY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const checkCollisionWithChar = () => {
        const charCenterX = position.x + CHAR_SIZE / 2;
        const charCenterY = position.y + CHAR_SIZE / 2;

        for (let fruitBall of fruitBalls) {
            const distance = calculateDistance(fruitBall.x, fruitBall.y, charCenterX, charCenterY);
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
        navigate('/point', { state: {selectedTab: '게임'}}); // 이전 페이지로 이동
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

    useEffect(() => {
        if (openDialog) { // 게임 오버 시 포인트 계산 및 전송
            const finalPoint = Math.floor(score / 100); // 100점당 1 포인트 계산
            setEarnedPoint(finalPoint);
            const token = localStorage.getItem('token');

            // 포인트 획득 여부와 상관없이 요청 전송
            axios.post('http://localhost:8080/api/point/result', {
                userIdx: parseInt(userIdx, 10),
                point: finalPoint,
                pointComment: finalPoint > 0 ? "과일 피하기 게임" : "과일 피하기 게임 실패" // point에 따라 comment 변경
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            })
                .then(response => {
                    console.log("포인트 저장 성공:", response.data);
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 401) {
                            console.error("Unauthorized: ", error.response.data);
                        } else {
                            console.error("Error saving matching game result:", error.response.data);
                        }
                    } else if (error.request) {
                        console.error("No response received from server:", error.request);
                    } else {
                        console.error("Error setting up the request:", error.message);
                    }
                });
        }
    }, [openDialog, score, userIdx]);

    useHeaderColorChange(location.pathname, '#C8EEFF');
    useNavigateNone();

    return (
        <div className="avoid-body">
            <button className="arrow-btn avoid" onClick={handleExit}><ArrowLeftLong/></button>
            <h1>FRUITS AVOID</h1>
            <div className="avoid-container">
                <canvas className="avoid-canvas" ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
                <div className="point-game-1st-btn">
                    {!gameStart && !openDialog && (
                        <button className="avoid-button center-button avoid-start-btn" onClick={handleGameStart}>
                            Start Game
                        </button>
                    )}
                    {openDialog && (
                        <button className="avoid-button center-button avoid-exit-btn" onClick={handleExit}>
                            Exit
                        </button>
                    )}
                </div>
                <div className="button-container">
                    <button className="avoid-button" onClick={moveCharLeft} disabled={!gameStart}>⬅️</button>
                    <button className="avoid-button" onClick={moveCharRight} disabled={!gameStart}>➡️</button>
                    <div className="avoid-score">Score: {score}</div>
                </div>
            </div>
            <div className="avoid-footer">
                {openDialog && <div className="avoid-dialog">Game Over!</div>}
                {openDialog && ( // openDialog가 true일 때만 포인트 획득 실패 메시지 표시
                    <div className="avoid-dialog-point">
                        {earnedPoint > 0 ? (
                            <p>{earnedPoint} 포인트 획득!</p>
                        ) : (
                            <p>포인트 획득 실패!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FruitsAvoid;
