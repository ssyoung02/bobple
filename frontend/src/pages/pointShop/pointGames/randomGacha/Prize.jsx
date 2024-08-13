import React, { useState, useEffect } from 'react';
import '../../../../assets/style/pointGame/gacha/Prize.scss';
import {useNavigate} from "react-router-dom";
import {getUserIdx} from "../../../../utils/auth";
import axios from 'axios';
import shine from '../../../../assets/images/shine_effect.png';
import { getRandomPrize } from '../../../../utils/GachaUtils'; // GachaUtils에서 getRandomPrize 가져오기

const Prize = () => {
    const navigate = useNavigate();
    const userIdx = getUserIdx();
    const [selectedPrize, setSelectedPrize] = useState(null);

    useEffect(() => {
        // 컴포넌트 마운트 시 랜덤 상품 선택
        setSelectedPrize(getRandomPrize());
    }, []);

    const handleButtonClick = () => {
        console.log('Button clicked!');
        navigate('/');
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 랜덤 상품 선택 및 포인트 처리
        const prize = getRandomPrize();
        setSelectedPrize(prize);

        const token = localStorage.getItem('token');
        console.log(prize.point);
        // 포인트 획득 여부와 상관없이 요청 전송
        axios.post('http://localhost:8080/api/point/result', {
            userIdx: parseInt(userIdx, 10),
            point: prize.point,
            pointComment: prize.point > 0 ? "가챠 게임" : "가챠 게임 실패" // point에 따라 comment 변경
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        })
            .then(response => {
                console.log("포인트 저장 성공:", response.data);
            })
            .catch(error => {
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
    }, []);


    return (
        <div className="prize-container">
            <div className="prize-ball-container"></div>
            <div className="prize-reward-container">
                <div className="shine">
                    <img src={shine} alt="Shine"/>
                </div>
                <div className="prize">
                    {selectedPrize && ( // selectedPrize가 null이 아닌 경우에만 이미지 렌더링
                        <img className="wiggle" src={selectedPrize.image} alt="Prize"/>
                    )}
                    <br/>
                    {selectedPrize && selectedPrize.point > 0 && ( // 포인트가 있는 경우에만 메시지 표시
                        <h3 className="point-message">{selectedPrize.point} 포인트 획득!</h3>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Prize;
