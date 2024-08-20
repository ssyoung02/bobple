import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../assets/style/pointGame/MatchingGame.css';
import { useHeaderColorChange, useNavigateNone } from '../../../../hooks/NavigateComponentHooks';
import {useLocation, useNavigate} from 'react-router-dom';
import { getUserIdx } from '../../../../utils/auth';
import Matching from '../../../../assets/images/MatchingGame.png';
import {ArrowLeftLong} from "../../../../components/imgcomponents/ImgComponents";

function MatchingGame() {
    const [userInput, setUserInput] = useState(''); // 사용자가 입력한 음식 이름 저장
    const [score, setScore] = useState(0); // 사용자가 맞힌 문제 수 저장
    const [currentGameIndex, setCurrentGameIndex] = useState(0); // 진행 중인 게임의 인덱스 관리
    const [showAnswer, setShowAnswer] = useState(false); // 사용자가 제출한 답에 대한 결과 공개 여부 관리
    const [answerResult, setAnswerResult] = useState(''); // 정답 또는 오답에 대한 피드백 메시지 저장
    const [randomGames, setRandomGames] = useState([]); // 서버에서 가져온 음식 사진을 랜덤으로 섞어 저장
    const [showResult, setShowResult] = useState(false); // 게임 종료 여부 관리
    const [earnedPoint, setEarnedPoint] = useState(0); // 종료 후 계산된 포인트 저장

    const location = useLocation();
    const userIdx = getUserIdx();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/api/matching-game/foods')
            .then(response => {
                const allGames = response.data;
                const shuffledGames = allGames.sort(() => 0.5 - Math.random()); // 게임 랜덤 셔플
                const selectedGames = shuffledGames.slice(0, 5); // 5개 선택
                setRandomGames(selectedGames);
            })
            .catch(error => {
                console.error('Error fetching matching games:', error);
            });
    }, []);

    // 사용자의 입력 값을 'userInput' 상태에 반영
    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };
    // 사용자가 입력한 음식 이름을 제출할 때 호출 (정답과 비교 후 결과 표시 및 점수 업데이트)
    const handleSubmit = (event) => {
        event.preventDefault();

        if (randomGames.length === 0) {
            return;
        }

        const currentGame = randomGames[currentGameIndex];
        const normalizedAnswer = userInput.toLowerCase().replace(/\s/g, '');
        const normalizedFoodName = currentGame.foodName.toLowerCase().replace(/\s/g, '');

        if (normalizedAnswer === normalizedFoodName ||
            (normalizedFoodName === '초밥' && normalizedAnswer === '스시')) {
            setAnswerResult(`맞았습니다! 정답: ${currentGame.foodName}`);
            setScore(score + 1);
        } else {
            setAnswerResult(`틀렸습니다! 정답: ${currentGame.foodName}`);
        }
        setShowAnswer(true);
        setUserInput('');
    };

    // 다음 게임으로 이동 (마지막 문제일 경우 결과 확인)
    const handleNext = () => {
        if (currentGameIndex === randomGames.length - 1 && showAnswer) {
            setShowResult(true);
        } else if (showAnswer) {
            setShowAnswer(false);
            setCurrentGameIndex(currentGameIndex + 1);
        } else {
            setShowAnswer(true);
        }
    };

    useEffect(() => {
        if (showResult) {
            const calculatedPoint = calculatePoint(score);
            setEarnedPoint(calculatedPoint);
            const token = localStorage.getItem('token');

            // 포인트 획득 여부와 상관없이 요청 전송
            axios.post('http://localhost:8080/api/point/result', {
                userIdx: parseInt(userIdx, 10),
                point: calculatedPoint,
                pointComment: calculatedPoint > 0 ? "음식 확대사진 맞추기 게임" : "음식 확대사진 맞추기 게임 실패" // point에 따라 comment 변경
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            }).then(response => {
                console.log("포인트 저장 성공:");
            }).catch(error => {
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
    }, [showResult, score, userIdx]);

    function calculatePoint(correctAnswers) {
        if (correctAnswers === 5) {
            return 5;
        } else {
            return 0;
        }
    }

    // 게임 탭 이동
    const moveGameHome = () => {
        navigate('/point', { state: {selectedTab: '게임'}});
    }

    useHeaderColorChange(location.pathname, '#FFE68B');
    useNavigateNone();

    const progressBarWidth = showResult
        ? '100%' // 게임이 종료되면 게이지를 꽉 채움
        : (currentGameIndex / randomGames.length) * 100 + '%';

    return (
        <div className="point-game-container">
            <button className="arrow-btn matching" onClick={moveGameHome}><ArrowLeftLong/></button>
            <h1 className="point-game-title">FOOD MATCHING</h1>
            <div className="point-progress-bar-container">
                <div className="point-progress-bar" style={{width: progressBarWidth}}></div>
            </div>
            <p className="point-game-round">Round {currentGameIndex + 1}/{randomGames.length}</p>

            {showResult ? (
                <div className="matching-result">
                    <h2>게임 종료!</h2>
                    <img src={Matching} alt="퀴즈"/>
                    <div className="matching-point-result">
                        <p>총 {score}개 맞췄습니다</p>
                        {earnedPoint > 0 ? (
                            <h3>{earnedPoint} 포인트 획득!</h3>
                        ) : (
                            <h3>포인트 획득 실패!</h3>
                        )}
                    </div>
                    <button onClick={moveGameHome}>돌아가기</button>
                </div>
            ) : (
                currentGameIndex < randomGames.length && (
                    <div>
                        {showAnswer ? (
                            <div className="matching-box">
                                <img
                                    src={randomGames[currentGameIndex].defaultImageUrl}
                                    alt="음식 원본 사진"
                                    style={{width: '200px', height: '200px'}}
                                />
                                <h5>{answerResult}</h5>
                                <button onClick={handleNext} className="matching-btn">
                                    {currentGameIndex === randomGames.length - 1 ? '결과 확인' : '다음 문제'}
                                </button>
                            </div>
                        ) : (
                            <div className="matching-box">
                                <img src={randomGames[currentGameIndex].largeImageUrl}
                                     alt="음식 확대 사진"
                                     style={{width: '200px', height: '200px'}}
                                />
                                <h5>이 사진의 음식은 무엇일까요?</h5>
                                <form onSubmit={handleSubmit}>
                                    <input className="matching-input" type="text" value={userInput}
                                           onChange={handleInputChange}/>
                                    <button className="matching-btn" type="submit">제출</button>
                                </form>
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
}

export default MatchingGame;
