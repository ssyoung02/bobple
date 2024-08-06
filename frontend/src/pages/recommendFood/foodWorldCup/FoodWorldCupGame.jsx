import React, { useState, useEffect } from 'react';
import '../../../assets/style/recommendFood/FoodWorldCupGame.css';
import {useNavigate} from "react-router-dom";

const items = [
    { id: 1, name: 'Pizza', img: 'https://via.placeholder.com/150?text=Pizza' },
    { id: 2, name: 'Burger', img: 'https://via.placeholder.com/150?text=Burger' },
    { id: 3, name: 'Sushi', img: 'https://via.placeholder.com/150?text=Sushi' },
    { id: 4, name: 'Pasta', img: 'https://via.placeholder.com/150?text=Pasta' },
    { id: 5, name: 'Salad', img: 'https://via.placeholder.com/150?text=Salad' },
    { id: 6, name: 'Tacos', img: 'https://via.placeholder.com/150?text=Tacos' },
    { id: 7, name: 'Ramen', img: 'https://via.placeholder.com/150?text=Ramen' },
    { id: 8, name: 'Steak', img: 'https://via.placeholder.com/150?text=Steak' },
    { id: 9, name: 'Ice Cream', img: 'https://via.placeholder.com/150?text=Ice+Cream' },
    { id: 10, name: 'Donuts', img: 'https://via.placeholder.com/150?text=Donuts' },
    { id: 11, name: 'Fries', img: 'https://via.placeholder.com/150?text=Fries' },
    { id: 12, name: 'Hot Dog', img: 'https://via.placeholder.com/150?text=Hot+Dog' },
    { id: 13, name: 'Sandwich', img: 'https://via.placeholder.com/150?text=Sandwich' },
    { id: 14, name: 'Pancakes', img: 'https://via.placeholder.com/150?text=Pancakes' },
    { id: 15, name: 'Cookies', img: 'https://via.placeholder.com/150?text=Cookies' },
    { id: 16, name: 'Chocolate', img: 'https://via.placeholder.com/150?text=Chocolate' },
];

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
        const shuffledItems = shuffle([...items]);
        setCurrentItems(shuffledItems.slice(0, round));
    }, []);

    useEffect(() => {
        if (currentItems.length >= 2) {
            setCurrentPair(currentItems.slice(0, 2));
        } else if (currentItems.length === 1) {
            setWinner(currentItems[0]);
        }
    }, [currentItems]);

    const handleSelect = (selectedItem) => {
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
                        <img src={winner.img} alt={winner.name}/>
                        <div className="food-item-name">{winner.name}</div>
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
                    <div key={index} className="food-item" onClick={() => handleSelect(item)}>
                        <img src={item.img} alt={item.name}/>
                        <div className="food-item-name">{item.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodWorldCupGame;
