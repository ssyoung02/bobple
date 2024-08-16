import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import moment from 'moment-timezone';
import 'moment/locale/ko'; // 한국어 로케일 추가
import '../../../assets/style/eatingGroup/GroupChatting.css';
import { ArrowLeftLong, Menu, SendMessage } from "../../../components/imgcomponents/ImgComponents";
import { useNavigateNone } from "../../../hooks/NavigateComponentHooks";
import ChattingModal from '../../../components/modal/ChattingModal';

const GroupChatting = () => {
    const { chatRoomId } = useParams();
    const numericChatRoomId = Number(chatRoomId);
    const navigate = useNavigate();
    const [chatRoom, setChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState(null);
    const [isChattingModalOpen, setIsChattingModalOpen] = useState(false);
    const socket = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        moment.locale('ko');

        const fetchChatRoom = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chatrooms/${numericChatRoomId}`);
                setChatRoom(response.data);
            } catch (error) {
                console.error('Failed to fetch chat room', error);
            }
        };

        const fetchJoinedAt = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log('Token:', token);  // 이 라인에서 토큰이 제대로 로드되고 있는지 확인
                const response = await axios.get(`http://localhost:8080/api/chatrooms/${numericChatRoomId}/joinedAt`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(`User joined at: ${response.data.joinedAt}`); // 가입 시점 콘솔 출력
                return response.data.joinedAt; // 사용자가 참여한 시점을 반환
            } catch (error) {
                console.error('Failed to fetch joinedAt', error);
                return null;
            }
        };

        const fetchMessages = async (joinedAt) => {
            try {
                const token = localStorage.getItem("token"); // 토큰 가져오기
                if (!token) {
                    throw new Error("No token found. Please log in.");
                }
                const response = await axios.get(`http://localhost:8080/api/chatrooms/${numericChatRoomId}/messages`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
                    },
                    params: { joinedAt } // 참여 시점 이후의 메시지 요청
                });
                const messagesWithFormattedTime = response.data.map(message => ({
                    ...message,
                    createdAt: moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')
                }));
                setMessages(messagesWithFormattedTime);
                console.log(`Last message time: ${messagesWithFormattedTime[messagesWithFormattedTime.length - 1]?.createdAt}`); // 마지막 메시지 시간 콘솔 출력

                for (let message of response.data) {
                    updateUnreadCounts(message.id);
                }
            } catch (error) {
                console.error('Failed to fetch messages', error);
            }
        };


        const fetchUser = async () => {
            const token = localStorage.getItem("token");
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

                // 유저 정보가 로드된 후 WebSocket 연결 및 채팅방 입장
                socket.current = io('http://localhost:3001', {
                    query: { userId: response.data.userIdx }
                });

                socket.current.emit('joinRoom', {
                    chatRoomId: numericChatRoomId,
                    userName: response.data.name,
                    userId: response.data.userIdx
                });

                socket.current.on('newMessage', (message) => {
                    const formattedMessage = {
                        ...message,
                        createdAt: moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')
                    };
                    setMessages(prevMessages => [...prevMessages, formattedMessage]);

                    updateUnreadCounts(message.id);
                    scrollToBottom();
                });

                socket.current.on('messageUnreadCount', ({ messageId, unreadCount }) => {
                    setMessages(prevMessages =>
                        prevMessages.map(message =>
                            message.id === messageId ? { ...message, unreadCount } : message
                        )
                    );
                });
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };

        const initChat = async () => {
            const joinedAt = await fetchJoinedAt(); // 사용자 참여 시점 가져오기
            fetchChatRoom();
            if (joinedAt) {
                fetchMessages(joinedAt); // 참여 시점 이후의 메시지만 가져오기
            }
            fetchUser();
        };

        initChat();

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [numericChatRoomId]);

    useEffect(() => {
        // 메시지 로딩이 완료된 후 스크롤 하단으로 이동
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const updateUnreadCounts = async (messageId) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/messages/${messageId}/unread-count`);
            setMessages(prevMessages => prevMessages.map(message =>
                message.id === messageId ? { ...message, unreadCount: response.data.unreadCount } : message
            ));
        } catch (error) {
            console.error('Failed to fetch unread counts', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user) {
            return;
        }

        try {
            const message = {
                chatRoomId: numericChatRoomId,
                content: newMessage,
                userId: user.userIdx,
                name: user.name,
                profileImage: user.profileImage,
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
            };

            await axios.post('http://localhost:3001/send-message', message);
            setNewMessage("");
            scrollToBottom();
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

    const openChattingModal = () => {
        setIsChattingModalOpen(true);
    };

    const closeChattingModal = () => {
        setIsChattingModalOpen(false);
    };

    useNavigateNone();

    return (
        <div className="chatting">
            {chatRoom && (
                <div className="chat-room-info">
                    <button onClick={handleGoBack}><ArrowLeftLong/></button>
                    <h2>{chatRoom.chatRoomTitle}</h2>
                    <h3>{chatRoom.chatRoomPeople}</h3>
                    <button onClick={openChattingModal}><Menu/></button>
                </div>
            )}
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index}
                         className={`message ${message.userId === user?.userIdx ? 'message-right' : 'message-left'}`}>

                        {message.userId !== user?.userIdx && (
                            <div className="message-row">
                                <img src={message.profileImage} alt={`${message.name}'s profile`}
                                     className="chat-profile-image"/>
                                <div className="message-user-info">
                                    <h5 className="message-user"><strong>{message.name}</strong></h5>
                                    <div className="message-bubble">
                                        <p className="message-content">{message.content}</p>
                                    </div>
                                </div>
                                <div className="message-time">
                                    <p>{moment(message.createdAt).format('h:mm')}</p>
                                    {message.unreadCount > 0 && (
                                        <span className="unread-count">{message.unreadCount}</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {message.userId === user?.userIdx && (
                            <div className="message-row message-right-row">
                                <div className="message-time">
                                    {message.unreadCount > 0 && (
                                        <span className="unread-count">{message.unreadCount}</span>
                                    )}
                                    <p>{moment(message.createdAt).format('h:mm')}</p>
                                </div>
                                <div className="message-bubble message-right-bubble">
                                    <p className="message-content">{message.content}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef}/>
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
                    <span><SendMessage/></span>
                </button>
            </div>

            {isChattingModalOpen && (
                <ChattingModal
                    modalState="show"
                    hideModal={closeChattingModal}
                    chatRoomId={numericChatRoomId}
                    chatRoomTitle={chatRoom?.chatRoomTitle || ''}
                    chatRoomPeople={chatRoom?.roomPeople || 0}
                />
            )}
        </div>
    );
};

export default GroupChatting;
