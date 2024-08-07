import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MatchingGame() {
    const [matchingGames, setMatchingGames] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [currentGameIndex, setCurrentGameIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [answerResult, setAnswerResult] = useState('');
    const [randomGames, setRandomGames] = useState([]);
    const [showResult, setShowResult] = useState(false);

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

    return (
        <div>
            <p>현재 라운드: {currentGameIndex + 1}/{randomGames.length}</p>

            {showResult ? ( // 결과 화면 조건
                <div>
                    <h2>게임 종료!</h2>
                    <p>총 {score}개 맞췄습니다!</p>
                </div>
            ) : (
                currentGameIndex < randomGames.length && ( // 문제 화면 조건
                    <div>
                        {showAnswer ? (
                            <div>
                                <img
                                    src={randomGames[currentGameIndex].defaultImageUrl}
                                    alt="음식 원본 사진"
                                    style={{ width: '200px', height: '200px' }}
                                />
                                <p>{answerResult}</p>
                                <button onClick={handleNext}>
                                    {currentGameIndex === randomGames.length - 1 ? '결과 확인' : '다음 문제'}
                                </button>
                            </div>
                        ) : (
                            <div>
                                <img src={randomGames[currentGameIndex].largeImageUrl}
                                     alt="음식 확대 사진"
                                     style={{ width: '200px', height: '200px' }}
                                />
                                <form onSubmit={handleSubmit}>
                                    <input type="text" value={userInput} onChange={handleInputChange} />
                                    <button type="submit">제출</button>
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