import React, { useState, useEffect } from 'react';
import '../../assets/style/eatingGroup/GroupMain.css';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../components/modal/ModalContext';
import axios from 'axios';
import { SearchIcon } from "../../components/imgcomponents/ImgComponents";
import io from 'socket.io-client';

const GroupMain = () => {
    const navigate = useNavigate();
    const { showModal, setModalType, setChatRoomData } = useModal();
    const [myChatRooms, setMyChatRooms] = useState([]);
    const [allChatRooms, setAllChatRooms] = useState([]);
    const [searchOption, setSearchOption] = useState('all-post');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredChatRooms, setFilteredChatRooms] = useState([]);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userIdx = localStorage.getItem('userIdx');

        const socket = io('http://localhost:3001', {
            query: { userIdx }
        });

        const fetchUnreadMessagesCount = async (chatRoomId) => {
            try {
                const response = await axios.get(`http://localhost:3001/api/chatrooms/${chatRoomId}/unread-messages-count`, {
                    params: { userId: userIdx }
                });
                setUnreadMessagesCount(prevState => ({
                    ...prevState,
                    [chatRoomId]: response.data.unreadCount
                }));
            } catch (error) {
                console.error('Failed to fetch unread messages count', error);
            }
        };

        const fetchMyChatRooms = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chatrooms/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // DENIED 상태의 채팅방을 제외
                const availableChatRooms = response.data.filter(room => room.status !== 'DENIED');
                setMyChatRooms(availableChatRooms);

                availableChatRooms.forEach(room => {
                    fetchUnreadMessagesCount(room.chatRoomIdx);
                });
            } catch (error) {
                console.error('Failed to fetch my chat rooms', error);
            }
        };

        const fetchAllChatRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/chatrooms/all', {
                    headers: { 'Authorization': `Bearer ${token}` } // 헤더에 토큰 추가
                });
                setAllChatRooms(response.data); // 모든 채팅방 설정
                setFilteredChatRooms(response.data); // 초기 필터링 상태 설정
            } catch (error) {
                console.error('Failed to fetch all chat rooms', error);
            }
        };

        fetchMyChatRooms();
        fetchAllChatRooms();

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const excludeMyChatRooms = allChatRooms.filter(
            (chatRoom) => !myChatRooms.some(myRoom => myRoom.chatRoomIdx === chatRoom.chatRoomIdx)
        );
        setFilteredChatRooms(excludeMyChatRooms);
    }, [allChatRooms, myChatRooms]);

    const handleRoomClick = (chatRoomId) => {
        setUnreadMessagesCount(prevState => ({
            ...prevState,
            [chatRoomId]: 0
        }));
        navigate(`/group/chatting/${chatRoomId}`);
    };

    const showCreateModal = () => {
        setModalType('createGroup');
        showModal();
    };

    const showJoinModal = (chatRoom) => {
        setChatRoomData(chatRoom);
        setModalType('joinGroup');
        showModal();
    };

    const handleSearch = () => {
        let filtered = allChatRooms.filter((chatRoom) => {
            const searchValue = searchKeyword.toLowerCase();
            switch (searchOption) {
                case 'title-post':
                    return chatRoom.chatRoomTitle.toLowerCase().includes(searchValue);
                case 'title-content':
                    return (
                        chatRoom.chatRoomTitle.toLowerCase().includes(searchValue) ||
                        chatRoom.description.toLowerCase().includes(searchValue)
                    );
                case 'location-post':
                    return chatRoom.location.toLowerCase().includes(searchValue);
                default:
                    return (
                        chatRoom.chatRoomTitle.toLowerCase().includes(searchValue) ||
                        chatRoom.description.toLowerCase().includes(searchValue) ||
                        chatRoom.location.toLowerCase().includes(searchValue)
                    );
            }
        });
        setFilteredChatRooms(filtered);
    };

    return (
        <div className="group-main">
            <h2 className="group-title">참여중인 모임</h2>
            <div className="group-header">
                <div className="scroll-container">
                    {myChatRooms.length > 0 ? (
                        myChatRooms.map((chatRoom) => (
                            <button
                                key={chatRoom.chatRoomIdx}
                                className="item"
                                onClick={() => handleRoomClick(chatRoom.chatRoomIdx)}
                            >
                                <img src={chatRoom.roomImage} alt="chat room" />
                                <span>{chatRoom.chatRoomTitle}</span>
                                {unreadMessagesCount[chatRoom.chatRoomIdx] > 0 && (
                                    <span className="groupmain-unread-count">
                                        {unreadMessagesCount[chatRoom.chatRoomIdx]}
                                    </span>
                                )}
                            </button>
                        ))
                    ) : (
                        <p>참여 중인 모임이 없네요,,ㅠ 모임에 참여해보세요!</p>
                    )}
                </div>
            </div>
            <div className="meeting-list">
                <h2 className="group-title">모집 중인 모임</h2>
                <fieldset className="search-box flex-row">
                    <select
                        className="group-search-select"
                        id="searchOption"
                        name="searchCnd"
                        title="검색 조건 선택"
                        onChange={(e) => setSearchOption(e.target.value)}
                    >
                        <option value="all-post">전체</option>
                        <option value="title-post">제목</option>
                        <option value="title-content">제목+내용</option>
                        <option value="location-post">장소</option>
                    </select>
                    <div className="search-field">
                        <input
                            className="group-search-box"
                            id="searchInput"
                            type="text"
                            name="searchWrd"
                            placeholder="검색어를 입력해주세요"
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button className="group-search-btn" onClick={handleSearch}>
                            <SearchIcon />
                        </button>
                    </div>
                </fieldset>
                {filteredChatRooms.length > 0 ? (
                    filteredChatRooms.map((chatRoom) => (
                        <button
                            key={chatRoom.chatRoomIdx}
                            className="meeting-item"
                            onClick={() => showJoinModal(chatRoom)}
                        >
                            <img src={chatRoom.roomImage} alt="chat room" />
                            <div className="meeting-info">
                                <h3>{chatRoom.chatRoomTitle}</h3>
                                <p>{chatRoom.description}</p>
                                <p>{chatRoom.location}</p>
                                <span>{new Date(chatRoom.createdAt).toLocaleDateString()}</span>
                            </div>
                        </button>
                    ))
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>

            <div className="fab-box">
                <button className="fab" onClick={showCreateModal}>
                    +
                </button>
            </div>
        </div>
    );
};

export default GroupMain;
