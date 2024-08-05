import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyPointUsage() {
    const [pointHistory, setPointHistory] = useState([]);
    const [currentPoints, setCurrentPoints] = useState(0);
    const [nickName, setNickName] = useState('');
    const [error, setError] = useState(null);

    const userIdx = localStorage.getItem('userIdx');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            alert('로그인이 필요합니다.');
            // Redirect or handle unauthenticated state here
            return;
        }
        fetchPointHistory();
    }, []);

    const fetchPointHistory = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/MyPointUsage/pointHistory/${userIdx}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            setNickName(response.data.nickName);
            setCurrentPoints(response.data.currentPoints);
            setPointHistory(response.data.history);
        } catch (error) {
            console.error('포인트 이력을 가져오는 데 실패했습니다.', error);
            setError('포인트 이력을 가져오는 중 오류가 발생했습니다.');
        }
    };

    const handlePurchase = async (productIdx) => {
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/purchaseProduct', null, {
                params: {
                    userIdx: userIdx,
                    productIdx: productIdx
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            alert('구매가 완료되었습니다.');
            // 구매 후 포인트 이력 새로 고침
            fetchPointHistory();
        } catch (error) {
            console.error('구매 실패:', error);
            alert('구매 실패: ' + (error.response?.data || '오류가 발생했습니다.'));
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

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
        </div>
    );
}

export default MyPointUsage;
