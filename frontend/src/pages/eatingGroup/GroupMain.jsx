import React, { useState, useEffect } from 'react';
import '../../assets/style/eatingGroup/GroupMain.css';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../components/modal/ModalContext';
import axios from 'axios';

const GroupMain = () => {
    const navigate = useNavigate();
    const { showModal, setModalType, setChatRoomData } = useModal();
    const [myChatRooms, setMyChatRooms] = useState([]);
    const [allChatRooms, setAllChatRooms] = useState([]);
    const [searchOption, setSearchOption] = useState('all-post');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filteredChatRooms, setFilteredChatRooms] = useState([]);

    useEffect(() => {
        const fetchMyChatRooms = async () => {
            try {
                const token = localStorage.getItem('token');
                const userIdx = localStorage.getItem('userIdx');

                console.log('Resolved token:', token);
                console.log('Resolved user ID:', userIdx);

                if (!token) {
                    console.error('No JWT token found');
                    return;
                }

                if (!userIdx) {
                    console.error('No user ID found');
                    return;
                }

                const myRoomsResponse = await axios.get(`http://localhost:8080/api/chatrooms/my`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setMyChatRooms(myRoomsResponse.data);
            } catch (error) {
                console.error('Failed to fetch my chat rooms', error);
            }
        };

        const fetchAllChatRooms = async () => {
            try {
                const allRoomsResponse = await axios.get('http://localhost:8080/api/chatrooms/all');
                setAllChatRooms(allRoomsResponse.data);
                setFilteredChatRooms(allRoomsResponse.data);
            } catch (error) {
                console.error('Failed to fetch all chat rooms', error);
            }
        };

        fetchMyChatRooms();
        fetchAllChatRooms();
    }, []);

    const handleRoomClick = (chatRoomId) => {
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
                    {myChatRooms.map((chatRoom) => (
                        <button
                            key={chatRoom.chatRoomIdx}
                            className="item"
                            onClick={() => handleRoomClick(chatRoom.chatRoomIdx)}
                        >
                            <img src="" alt="" />
                            <span>{chatRoom.chatRoomTitle}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="meeting-list">
                <h2 className="group-title">모집 중인 모임</h2>
                <fieldset className="search-box flex-row">
                    <select
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
                    <p className="search-field">
                        <input
                            id="searchInput"
                            type="text"
                            name="searchWrd"
                            placeholder="검색어를 입력해주세요"
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button onClick={handleSearch}>
                            <span className="hide">검색</span>
                            <i className="bi bi-search"></i>
                        </button>
                    </p>
                </fieldset>
                {filteredChatRooms.length > 0 ? (
                    filteredChatRooms.map((chatRoom) => (
                        <button
                            key={chatRoom.chatRoomIdx}
                            className="meeting-item"
                            onClick={() => showJoinModal(chatRoom)}
                        >
                            <img src="" alt="" />
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
