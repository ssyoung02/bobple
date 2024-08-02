import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyPointUsage() {
    const [pointHistory, setPointHistory] = useState([]);
    const [currentPoints, setCurrentPoints] = useState(0);
    const [nickName, setNickName] = useState(''); // 닉네임 상태 추가
    const userIdx = 9; // 사용자 ID, 실제 앱에서는 로그인 정보에서 가져올 수 있습니다.

    useEffect(() => {
        axios.get(`http://localhost:8080/api/MyPointUsage/pointHistory/${userIdx}`)
            .then(response => {
                setNickName(response.data.nickName); // 닉네임 설정
                setPointHistory(response.data.history);
                setCurrentPoints(response.data.currentPoints);
            })
            .catch(error => {
                console.error('포인트 이력을 가져오는 데 실패했습니다.', error);
            });
    }, []);

    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            textAlign: 'center',
            marginBottom: '20px',
        },
        listItem: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            padding: '10px',
            borderBottom: '1px solid #ccc',
        },
        pointsChange: {
            fontWeight: 'bold',
            color: 'green',
        },
        pointsChangeNegative: {
            color: 'red',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1>{nickName}의 포인트</h1> {/* 닉네임 표시 */}
                <h2>{currentPoints}P</h2>
            </div>
            <div>
                {pointHistory.map((item, index) => (
                    <div key={index} style={styles.listItem}>
                        <div>{item.date}</div>
                        <div>{item.description}</div>
                        <div style={item.points > 0 ? styles.pointsChange : {...styles.pointsChange, ...styles.pointsChangeNegative}}>
                            {item.points > 0 ? `+${item.points}` : item.points}P
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyPointUsage;
