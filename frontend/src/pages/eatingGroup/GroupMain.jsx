import React, { useState, useEffect } from 'react';
import '../../assets/style/GroupMain.css';
import { useNavigate } from "react-router-dom";
import { useModal } from "../../components/modal/ModalContext";
import axios from 'axios';

const GroupMain = () => {
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const response = await axios.get('/api/chatrooms');
                setChatRooms(response.data);
            } catch (error) {
                console.error('Failed to fetch chat rooms', error);
            }
        };

        fetchChatRooms();
    }, []);

    const handleRoomClick = (chatRoomId) => {
        navigate(`/group/chatting/${chatRoomId}`);
    };

    return (
        <div className="group-main">
            <h2 className="group-title">참여중인 모임</h2>
            <div className="group-header">
                <div className="scroll-container">
                    {chatRooms.map(chatRoom => (
                        <button
                            key={chatRoom.chatRoomIdx}
                            className="item"
                            onClick={() => handleRoomClick(chatRoom.chatRoomIdx)}
                        >
                            <img src="" alt=""/><span>{chatRoom.chatRoomTitle}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="meeting-list">
                <h2 className="group-title">모집 중인 모임</h2>
                {chatRooms.map(chatRoom => (
                    <button
                        key={chatRoom.chatRoomIdx}
                        className="meeting-item"
                        onClick={() => handleRoomClick(chatRoom.chatRoomIdx)}
                    >
                        <img src="" alt=""/>
                        <div className="meeting-info">
                            <h3>{chatRoom.chatRoomTitle}</h3>
                            <p>{chatRoom.description}</p>
                            <span>{new Date(chatRoom.createdAt).toLocaleDateString()}</span>
                        </div>
                    </button>
                ))}
            </div>

            <button className="fab" onClick={showModal}>+</button>
        </div>
    );
};

export default GroupMain;