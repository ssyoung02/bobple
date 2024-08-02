import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/style/eatingGroup/GroupChatting.css';

const GroupChatting = () => {
    const { chatRoomId } = useParams();
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

    return (
        <div className="chatting">
            {chatRoom && (
                <div className="chat-room-info">
                    <h2>{chatRoom.chatRoomTitle}</h2>
                    <p>{chatRoom.description}</p>
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
                <button onClick={handleSendMessage}>전송</button>
            </div>
        </div>
    );
};

export default GroupChatting;
