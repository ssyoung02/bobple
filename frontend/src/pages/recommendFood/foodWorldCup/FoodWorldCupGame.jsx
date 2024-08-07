import React, { useState, useEffect } from 'react';
import '../../../assets/style/recommendFood/FoodWorldCupGame.css';
import {useNavigate} from "react-router-dom";
import axios from "axios";

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

const FoodWorldCupGame = () => {
    const [round, setRound] = useState(16);
    const [currentItems, setCurrentItems] = useState([]);
    const [nextRoundItems, setNextRoundItems] = useState([]);
    const [currentPair, setCurrentPair] = useState([]);
    const [pairIndex, setPairIndex] = useState(1);
    const [winner, setWinner] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => { // 즉시 실행되는 비동기 함수
            try {
                const response = await axios.get('http://localhost:8080/api/foodWorldcup/foods');
                const shuffledItems = shuffle(response.data);
                setCurrentItems(shuffledItems.slice(0, round));
            } catch (error) {
                console.error('음식 정보 가져오기 실패:', error);
            }
        })();
    }, []);

    useEffect(() => {
        console.log('currentItems 업데이트:', currentItems);

        if (currentItems.length >= 2) {
            setCurrentPair(currentItems.slice(0, 2));
        } else if (currentItems.length === 1) {
            setWinner(currentItems[0]);
        }
    }, [currentItems]);

    const handleSelect = (selectedItem) => {
        console.log('선택된 아이템:', selectedItem);
        setNextRoundItems((prev) => [...prev, selectedItem]);

        if (currentItems.length > 2) {
            setCurrentItems((prev) => prev.slice(2));
            setPairIndex(pairIndex + 1);
        } else {
            const shuffledNextRoundItems = shuffle([...nextRoundItems, selectedItem]);
            setCurrentItems(shuffledNextRoundItems);
            setNextRoundItems([]);
            setRound(round / 2);
            setPairIndex(1);
        }
    };

    const moveRecommend = () => {
        navigate('/recommend');
    }

    if (winner) {
        return (
            <div className="food-world-cup-game">
                <div className="worldCup-header">
                    <h2 className="worldCup-game-title">Food World Cup</h2>
                </div>
                <div className="winner-box">
                    <br/>
                    <h2>Winner!</h2>
                    <div className="food-winner-item">
                        <h3 className="food-winner-title">오늘 메뉴는</h3>
                        <img src={winner.foodImageUrl} /> {/* winner.img -> winner.foodImageUrl */}
                        <div className="food-item-name">{winner.foodName}</div>
                    </div>
                    <button className="back-recommend-btn" onClick={moveRecommend}>돌아가기➡️</button>
                </div>
            </div>
        );
    }

    return (
        <div className="food-world-cup-game">
            <div className="worldCup-header">
                <h2 className="worldCup-game-title">Food World Cup</h2>
            </div>
            <div className="round-info">
                <span>Round of {round}</span><br/>
                ({pairIndex}/{round / 2})
            </div>
            <div className="items-grid">
                <div className="worldCup-vs">VS</div>
                {currentPair.map((item, index) => (
                    <div key={item.foodIdx} className="food-item" onClick={() => handleSelect(item)}>
                        <img src={item.foodImageUrl} />
                        <div className="food-item-name">{item.foodName}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodWorldCupGame;
