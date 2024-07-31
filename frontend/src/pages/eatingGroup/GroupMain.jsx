import React, {useState, useRef, useEffect} from 'react';
import '../../assets/style/GroupMain.css';
import {useModal} from "../../components/modal/ModalContext";

const GroupMain = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const modalBackground = useRef();
    const { setModalType, showModal } = useModal();

    useEffect(() => {
        setModalType("groupInform");
    });

    return (
        <div className="group-main">
            <h2 className="group-title">참여중인 모임</h2>
            <div className="group-header">
                <div className="scroll-container">
                    <button className="item"><img src="" alt=""/><span>강남된코회식</span></button>
                    <button className="item"><img src="" alt=""/><span>마라탕??</span></button>
                    <button className="item"><img src="" alt=""/><span>집에가기싫음</span></button>
                    <button className="item"><img src="" alt=""/><span>퇴근하기모임</span></button>
                    <button className="item"><img src="" alt=""/><span>퇴근하기모임</span></button>
                    <button className="item"><img src="" alt=""/><span>퇴근하기모임</span></button>
                </div>
            </div>
            <div className="meeting-list">
                <h2 className="group-title">모집 중인 모임</h2>
                <button className="meeting-item">
                    <img src="" alt=""/>
                    <div className="meeting-info">
                        <h3>매일점심메이트 13</h3>
                        <p>진짜 점심만 먹고 헤어집니다. 친목질X</p>
                        <span>어제</span>
                    </div>
                </button>
                <button className="meeting-item">
                    <img src="" alt=""/>
                    <div className="meeting-info">
                        <h3>마라탕메이트 8</h3>
                        <p>마라탕 같이 먹어주실분! 탕후루는 알아서</p>
                        <span>07.13</span>
                    </div>
                </button>
                <button className="meeting-item">
                    <img src="" alt=""/>
                    <div className="meeting-info">
                        <h3>아침먹는모임 5</h3>
                        <p>집에서 아침 안먹고 오는사람 모여라</p>
                        <span>07.10</span>
                    </div>
                </button>
                <button className="meeting-item">
                    <img src="" alt=""/>
                    <div className="meeting-info">
                        <h3>아침먹는모임 5</h3>
                        <p>집에서 아침 안먹고 오는사람 모여라</p>
                        <span>07.10</span>
                    </div>
                </button>
                <button className="meeting-item">
                    <img src="" alt=""/>
                    <div className="meeting-info">
                        <h3>아침먹는모임 5</h3>
                        <p>집에서 아침 안먹고 오는사람 모여라</p>
                        <span>07.10</span>
                    </div>
                </button>
                <button className="meeting-item">
                    <img src="" alt=""/>
                    <div className="meeting-info">
                        <h3>아침먹는모임 5</h3>
                        <p>집에서 아침 안먹고 오는사람 모여라</p>
                        <span>07.10</span>
                    </div>
                </button>
            </div>

            <button className="fab" onClick={showModal}>+</button>
        </div>
    );
};

export default GroupMain;
