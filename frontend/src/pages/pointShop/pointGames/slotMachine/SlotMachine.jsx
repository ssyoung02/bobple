import React, { useState, useRef } from "react";
import Dashboard from "./Dashboard";
import "../../../../assets/style/pointGame/slot/SlotMachine.css";
import {getUserIdx} from "../../../../utils/auth";
import axios from "axios";
import {useHeaderColorChange, useNavigateNone} from "../../../../hooks/NavigateComponentHooks";
import {useLocation} from "react-router-dom";

const SlotMachine = () => {
    const [rolling, setRolling] = useState(false);
    const [stoppedSlots, setStoppedSlots] = useState(0);
    const [resultMessage, setResultMessage] = useState("");
    const slotRefs = [useRef(null), useRef(null), useRef(null)];
    const fruits = ["🍒", "🍉", "🍊", "🍓", "🍇", "🥝", "🍍", "🍎", "🍋", "💎"];
    const userIdx=getUserIdx();
    const location = useLocation();

    const roll = () => {
        if (!rolling) {
            setRolling(true);
            setStoppedSlots(0);
            setResultMessage("");
            startRolling();
        } else {
            stopSlot();
        }
    };

    const startRolling = () => {
        slotRefs.forEach((slot) => {
            if (slot.current) {
                slot.current.startRolling();
            }
        });
    };

    const stopSlot = () => {
        slotRefs[stoppedSlots].current.stopRolling();
        setStoppedSlots((prev) => {
            const newStoppedSlots = prev + 1;
            if (newStoppedSlots === 3) {
                setRolling(false);
                setTimeout(checkResult, 500); // Give some time for the slots to stop completely
            }
            return newStoppedSlots;
        });
    };

    const checkResult = () => {
        const slotItems = slotRefs.map(ref => ref.current.getResult());
        const isWin = slotItems.every((item, _, arr) => item === arr[0]);

        let earnedPoint = 0;
        let message = ""; // 메시지를 저장할 변수 추가


        if (isWin) {
            if (slotItems[0] || slotItems[1] || slotItems[2]=== "💎") {
                console.log(slotItems[0]);
                earnedPoint = 50;
                message = `${earnedPoint} 포인트 획득! (💎 당첨!)`; // 보석 당첨 메시지
            } else {
                console.log(slotItems[0]);
                earnedPoint = 10;
                message = `${earnedPoint} 포인트 획득!`; // 일반 당첨 메시지
            }
        } else {
            message = "다음 기회에...";
        }

        setResultMessage(message); // 계산된 메시지로 설정

        // 포인트 저장 요청 (userIdx 필요)
        if (earnedPoint > 0) {
            const token = localStorage.getItem('token');

            axios.post('http://localhost:8080/api/point/result', {
                userIdx: parseInt(userIdx, 10),
                point: earnedPoint,
                pointComment: "슬롯 게임"
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            }).then(response => {
                console.log("포인트 저장 성공:", response.data);
            }).catch(error => {
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
    };


    const reset = () => {
        setRolling(false);
        setStoppedSlots(0);
        setResultMessage("");
        slotRefs.forEach(slot => {
            if (slot.current) {
                slot.current.reset();
            }
        });
    };

    useHeaderColorChange(location.pathname, '#CCE1AB');
    useNavigateNone();


    return (
        <div className="slot-game-container">
            <h1 className="slot-title">SLOT MACHINE</h1>
            <div className="slot-game">
                <Dashboard rolling={rolling} slotRefs={slotRefs} fruits={fruits} />
                <div className="machine-controls">
                    <div className="machine-roll" onClick={roll}>
                        {rolling ? `STOP ${3 - stoppedSlots}` : "ROLL"}
                    </div>
                    <div className="machine-reset" onClick={reset}>
                        RESET
                    </div>
                </div>
                {resultMessage && <div className="slot-result">{resultMessage}</div>}
            </div>
        </div>
    );
};

export default SlotMachine;
