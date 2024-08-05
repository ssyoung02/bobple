import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/style/myPage/MyPointUsage.css';

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
        <div className="my-point-usage-main">
            <div className="my-point-total">
                <h3>{nickName}님의 포인트</h3>
                <h3 className="mypoint">{currentPoints}P</h3>
            </div>

            <div className="point-usage-box">
                <h5>포인트 사용 내역</h5>
                <ul className="point-usage-list">
                    {pointHistory.map((point, index) => (
                        <li key={index}>
                            <div className="point-usage-details">
                                <p className="point-usage-date">{new Date(point.createdAt).toLocaleString()}</p>
                                <h6 className="point-usage-title">
                                    {point.pointComment}
                                </h6>
                            </div>
                            <div className="budget">
                                <p className=
                                    {point.pointState === 'M' ? 'point-usage-money deduction' : 'point-usage-money'}
                                >
                                    {(point.pointState === 'M' ? '-' : '+') + Math.abs(point.pointValue)}P
                                </p>
                                <p className="balance">
                                    잔액: {point.pointBalance}P
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MyPointUsage;
