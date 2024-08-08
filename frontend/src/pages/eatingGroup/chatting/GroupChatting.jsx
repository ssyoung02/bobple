import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import '../../../assets/style/eatingGroup/GroupChatting.css';
import { ArrowLeftLong, Menu, SendMessage } from "../../../components/imgcomponents/ImgComponents";
import { useNavigateNone } from "../../../hooks/NavigateComponentHooks";
import { useModal } from "../../../components/modal/ModalContext";

const GroupChatting = () => {
    const { chatRoomId } = useParams();
    const navigate = useNavigate();
    const [chatRoom, setChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState(null);
    const { showModal, setModalType, setChatRoomData } = useModal();
    const socket = io('http://localhost:3001');

    useEffect(() => {
        const fetchChatRoom = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chatrooms/${chatRoomId}`);
                setChatRoom(response.data);
            } catch (error) {
                console.error('Failed to fetch chat room', error);
            }
        };

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chatrooms/${chatRoomId}/messages`);
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages', error);
            }
        };

        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            console.log("Token from localStorage: ", token); // 추가 로그
            if (!token) {
                console.error('No token found. Please log in.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                if (error.response) {
                    // Request made and server responded
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                    console.error('Error headers:', error.response.headers);
                } else if (error.request) {
                    // Request made but no response received
                    console.error('Error request:', error.request);
                } else {
                    // Something happened in setting up the request
                    console.error('Error message:', error.message);
                }
                console.error('Failed to fetch user', error);
            }
        };

        fetchChatRoom();
        fetchMessages();
        fetchUser();

        socket.emit('joinRoom', chatRoomId);

        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.disconnect();
        };
    }, [chatRoomId, navigate]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) {
            return;
        }

        try {
            const message = {
                chatRoomId: chatRoomId,
                content: newMessage,
                userId: user.userIdx,
                name: user.name,
                profileImage: user.profileImage
            };

            console.log("Sending message:", message);

            await axios.post('http://localhost:3001/send-message', message);
            setNewMessage("");
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const handleGoBack = () => {
        navigate('/group');
    };

    const showChattingModal = (chatRoom) => {
        setChatRoomData(chatRoom);
        setModalType('chatting');
        showModal();
    };

    useNavigateNone();

    return (
        <div className="chatting">
            {chatRoom && (
                <div className="chat-room-info">
                    <button onClick={handleGoBack}><ArrowLeftLong /></button>
                    <h2>{chatRoom.chatRoomTitle}</h2>
                    <h3>{chatRoom.chatRoomPeople}</h3>
                    <button onClick={() => showChattingModal(chatRoom)}><Menu /></button>
                </div>
            )}
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <img src={message.profileImage} alt={`${message.name}'s profile`} className="profile-image" />
                        <p><strong>{message.name}</strong>: {message.content}</p>
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요"
                />
                <button onClick={handleSendMessage}>
                    <span><SendMessage /></span>
                </button>
            </div>
        </div>
    );
};

export default GroupChatting;
