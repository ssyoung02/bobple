import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyPointUsage() {
    const [pointHistory, setPointHistory] = useState([]);
    const [currentPoints, setCurrentPoints] = useState(0);
    const [nickName, setNickName] = useState('');
    const userIdx = 9; // 사용자 ID

    useEffect(() => {
        fetchPointHistory(userIdx);
    }, []);

    const fetchPointHistory = async (userIdx) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/MyPointUsage/pointHistory/${userIdx}`);
            setNickName(response.data.nickName);
            setCurrentPoints(response.data.currentPoints);
            setPointHistory(response.data.history);
        } catch (error) {
            console.error('포인트 이력을 가져오는 데 실패했습니다.', error);
        }
    };

    const handlePurchase = async (productIdx) => {
        try {
            const response = await axios.post('http://localhost:8080/api/purchaseProduct', null, {
                params: {
                    userIdx: userIdx,
                    productIdx: productIdx
                }
            });
            alert(response.data);
            // 구매 후 포인트 이력 새로 고침
            fetchPointHistory(userIdx);
        } catch (error) {
            alert('구매 실패: ' + error.response.data);
        }
    };

    return (
        <div>
            <h1>{nickName}의 포인트</h1>
            <h2>총 포인트: {currentPoints}P</h2>
            <h3>포인트 사용 내역</h3>
            <ul>
                {pointHistory.map((point, index) => (
                    <li key={index}>
                        {point.pointComment}: {(point.pointState === 'M' ? '-' : '+') + Math.abs(point.pointValue)}P
                        <br />
                        거래 후 잔액: {point.pointBalance}P
                        <br />
                        <small>{new Date(point.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
            <button onClick={() => handlePurchase(1)}>상품 구매하기</button> {/* 예시로 productIdx를 1로 설정 */}
        </div>
    );
}

export default MyPointUsage;
