import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../assets/style/pointGame/MatchingGame.css'
import {useHeaderColorChange, useNavigateNone} from "../../../../hooks/NavigateComponentHooks";
import {useLocation} from "react-router-dom";
import {getUserIdx} from "../../../../utils/auth";

function MatchingGame() {
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [currentGameIndex, setCurrentGameIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [answerResult, setAnswerResult] = useState('');
    const [randomGames, setRandomGames] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const location = useLocation();
    const [earnedPoint, setEarnedPoint] = useState(0);
    const userIdx=getUserIdx();

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


    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // randomGames가 비어있는지 확인
        if (randomGames.length === 0) {
            return; // 빈 배열이면 아무 동작도 하지 않음
        }

        const currentGame = randomGames[currentGameIndex];
        const normalizedAnswer = userInput.toLowerCase().replace(/\s/g, ''); // 공백 제거 및 소문자 변환
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

    const handleNext = () => {
        if (currentGameIndex === randomGames.length - 1 && showAnswer) {
            setShowResult(true); // 결과 화면 표시
        } else if (showAnswer) {
            setShowAnswer(false);
            setCurrentGameIndex(currentGameIndex + 1);
        } else {
            setShowAnswer(true);
        }
    };

    useEffect(() => {
        if (showResult) {
            const calculatedPoint = calculatePoint(score); // 포인트 계산 로직
            setEarnedPoint(calculatedPoint);
            const token = localStorage.getItem('token');

            axios.post('http://localhost:8080/api/matchingGame/result', {
                userIdx: parseInt(userIdx, 10),
                point: calculatedPoint // 계산된 포인트 전달
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            }).then(response => {
                console.log("포인트 저장 성공:");
            }).catch(error => {
                if (error.response) {
                    // 서버에서 에러 응답을 받은 경우
                    if (error.response.status === 401) {
                        console.error("Unauthorized: ", error.response.data);
                        // 사용자에게 로그인 필요 알림 등 추가 처리
                    } else {
                        console.error("Error saving matching game result:", error.response.data); // 에러 메시지 출력
                    }
                } else if (error.request) {
                    // 요청을 보냈지만 응답을 받지 못한 경우
                    console.error("No response received from server:", error.request);
                } else {
                    // 요청 설정 중에 에러가 발생한 경우
                    console.error("Error setting up the request:", error.message);
                }
            });
        }
    }, [showResult, score, userIdx]);

    function calculatePoint(correctAnswers) {
        // 게임별 포인트 계산 로직 구현
        if (correctAnswers == 5) {
            return 5;
        } else if (correctAnswers == 4) {
            return 3;
        } else {
            return 0;
        }
    }

    useHeaderColorChange(location.pathname,'#FFE68B'); //
    useNavigateNone();

    return (
        <div className="point-game-container">

            <h1 className="point-game-title">FOOD MATCHING</h1>
            <p className="point-game-round">Round {currentGameIndex + 1}/{randomGames.length}</p>

            {showResult ? ( // 결과 화면 조건
                <div className="matching-result">
                    <h2>게임 종료!</h2>
                    <p>총 {score}개 맞췄습니다!</p>
                    {earnedPoint > 0 ? ( // 획득 포인트가 0보다 크면 성공 메시지
                        <p>{earnedPoint} 포인트 획득!</p>
                    ) : ( // 획득 포인트가 0이면 실패 메시지
                        <p>포인트 획득 실패!</p>
                    )}
                </div>
            ) : (
                currentGameIndex < randomGames.length && ( // 문제 화면 조건
                    <div>
                        {showAnswer ? (
                            <div className="matching-box">
                                <img
                                    src={randomGames[currentGameIndex].defaultImageUrl}
                                    alt="음식 원본 사진"
                                    style={{ width: '200px', height: '200px' }}
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
                                    <input className="matching-input" type="text" value={userInput} onChange={handleInputChange}/>
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