import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import moment from 'moment-timezone';
import 'moment/locale/ko'; // 한국어 로케일 추가
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

    const messagesEndRef = useRef(null); // 스크롤 하단으로 이동하기 위한 ref

    useEffect(() => {
        moment.locale('ko'); // 한국어 로케일 설정

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
                const messagesWithFormattedTime = response.data.map(message => ({
                    ...message,
                    createdAt: moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')
                }));
                setMessages(messagesWithFormattedTime);
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
                    console.error('Error response:', error.response.data);
                    console.error('Error status:', error.response.status);
                    console.error('Error headers:', error.response.headers);
                } else if (error.request) {
                    console.error('Error request:', error.request);
                } else {
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
            console.log("New message received at: ", moment().format('YYYY-MM-DD HH:mm:ss'));
            const formattedMessage = {
                ...message,
                createdAt: moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')
            };
            setMessages((prevMessages) => [...prevMessages, formattedMessage]);
            scrollToBottom(); // 새로운 메시지 추가 시 스크롤 하단으로 이동
        });

        return () => {
            socket.disconnect();
        };
    }, [chatRoomId, navigate]);

    useEffect(() => {
        // 메시지 로딩이 완료된 후 스크롤 하단으로 이동
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                profileImage: user.profileImage,
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss') // 현재 시간 추가
            };

            console.log("Sending message:", message);

            await axios.post('http://localhost:3001/send-message', message);
            setNewMessage("");
            scrollToBottom(); // 메시지 전송 후 스크롤 하단으로 이동
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
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
                    <div key={index} className={`message ${message.userId === user?.userIdx ? 'message-right' : 'message-left'}`}>
                        <img src={message.profileImage} alt={`${message.name}'s profile`} className="profile-image" />
                        <div className="message-content">
                            <p><strong>{message.name}</strong>: {message.content}</p>
                            <p>{moment(message.createdAt).format('a h:mm')}</p> {/* 시간 표시 */}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* 스크롤 하단을 참조하는 div */}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
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
