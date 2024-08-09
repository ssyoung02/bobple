import React, { useState, useEffect } from 'react';
import '../../../assets/style/recommendFood/FoodWorldCupGame.css';
import {useLocation, useNavigate} from "react-router-dom";
import { useNavigateNone, useHeaderColorChange } from "../../../hooks/NavigateComponentHooks";
import axios from "axios";
import {Trophy} from "../../../components/imgcomponents/ImgComponents";

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
    const location = useLocation();

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

    // 게이지 바의 진행 상황을 계산합니다.
    const progress = ((pairIndex - 1) / (round / 2)) * 100;

    useHeaderColorChange(location.pathname,'#F5A8BE'); //
    useNavigateNone();

    if (winner) {
        return (
            <div className="worldCup-container game-container">
                <h1 className="worldCup-title game-title">Food World Cup</h1>
                <div className="winner-box">
                    <div className="round-info">
                        <div className="progress-bar">
                            <div className="progress" style={{width: `100}%`}}></div>
                        </div>
                        <span>Winner!</span><br/>
                    </div>
                    <div className="food-winner-item">
                        <span><Trophy/></span>
                        <h3 className="food-winner-title">오늘 메뉴는</h3>
                        <img src={winner.foodImageUrl}/> {/* winner.img -> winner.foodImageUrl */}
                        <h3 className="food-item-name">{winner.foodName}</h3>
                    </div>
                    <div className="back-recommend">
                        <button className="back-recommend-btn" onClick={moveRecommend}>돌아가기 ➡️</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="worldCup-container game-container">
            <h1 className="worldCup-title game-title">Food World Cup</h1>
            <div className="round-info">
                <span>Round of {round}</span>
                <div className="progress-bar">
                    <div className="progress" style={{width: `${progress}%`}}></div>
                </div>
                ({pairIndex}/{round / 2})
            </div>
            <div className="items-grid">
                <h3 className="worldCup-vs">VS</h3>
                {currentPair.map((item, index) => (
                    <div key={item.foodIdx} className="food-item" onClick={() => handleSelect(item)}>
                        <div className="food-box">
                            <img src={item.foodImageUrl}/>
                        </div>
                        <h3 className="food-item-name">{item.foodName}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodWorldCupGame;
