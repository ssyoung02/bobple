import React, { useState, useEffect } from 'react';
import '../../../../assets/style/pointGame/gacha/Prize.scss';
import {useNavigate} from "react-router-dom";
import {getUserIdx} from "../../../../utils/auth";
import axios from 'axios';
import shine from '../../../../assets/images/shine_effect.png'

const Prize = () => {
    const navigate = useNavigate();
    const userIdx=getUserIdx();

    const prizes = [
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/Bomb.png', point: 0 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/Bomb.png', point: 0 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/Bomb.png', point: 0 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/Bomb.png', point: 0 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/Bomb.png', point: 0 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/Bomb.png', point: 0 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/1.png', point: 1 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/1.png', point: 1 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/1.png', point: 1 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/1.png', point: 1 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/1.png', point: 1 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/1.png', point: 1 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/2.png', point: 2 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/2.png', point: 2 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/2.png', point: 2 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/3.png', point: 3 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/3.png', point: 3 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/5.png', point: 5 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/5.png', point: 5 },
        { image: 'https://bobple.kr.object.ncloudstorage.com/gacha_prize/10.png', point: 10 }
    ];

    // 랜덤으로 상품 뽑기
    const getRandomPrize = () => {
        const totalWeight = prizes.reduce((sum, prize) => sum + prize.point + 1, 0); // 꽝에도 가중치 1 부여
        let randomNum = Math.random() * totalWeight;
        for (let prize of prizes) {
            randomNum -= prize.point + 1;
            if (randomNum <= 0) {
                return prize;
            }
        }
    };

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

        if (prize.point > 0) { // 포인트 획득 시에만 요청 전송
            const token = localStorage.getItem('token');
            const userIdx = getUserIdx();

            axios.post('http://localhost:8080/api/point/result', { // 백엔드 엔드포인트 확인
                userIdx: parseInt(userIdx, 10),
                point: prize.point,
                pointComment: "가챠 게임"
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
