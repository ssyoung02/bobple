import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/style/eatingGroup/GroupChatting.css';
import {ArrowLeftLong, Menu, SendMessage} from "../../../components/imgcomponents/ImgComponents";
import {useNavigateNone} from "../../../hooks/NavigateComponentHooks";

const GroupChatting = () => {
    const { chatRoomId } = useParams();
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [chatRoom, setChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

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

        fetchChatRoom();
        fetchMessages();

        const eventSource = new EventSource('http://localhost:3001/events');
        eventSource.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, newMessage]);
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
        };

        return () => {
            eventSource.close();
        };
    }, [chatRoomId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            return;
        }

        try {
            const message = {
                chatRoomId: chatRoomId,
                content: newMessage
            };
            await axios.post('http://localhost:3001/send-message', message);
            setNewMessage("");
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const handleGoBack = () => {
        navigate('/group'); // GroupMain 화면으로 이동
    };

    useNavigateNone();

    return (
        <div className="chatting">
            {chatRoom && (
                <div className="chat-room-info">
                    <button onClick={handleGoBack}><ArrowLeftLong/></button>
                    <h2>{chatRoom.chatRoomTitle}</h2>
                    <h3>{chatRoom.chatRoomPeople}</h3>
                    <button><Menu/></button>
                </div>
            )}
            <div className="messages">
            {messages.map((message, index) => (
                    <div key={index} className="message">
                        <p>{message.content}</p>
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
                    <span><SendMessage/></span>
                </button>
            </div>
        </div>
    );
};

export default GroupChatting;