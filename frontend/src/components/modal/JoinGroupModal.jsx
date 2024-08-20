import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import bobple from '../../assets/images/bobple_mascot.png';

const JoinGroupModal = ({ modalState, hideModal, chatRoomId, chatRoomTitle, chatRoomDescription, chatRoomPeople, chatRoomImage, currentParticipants }) => {
    const navigate = useNavigate();
    const [image, setImage] = useState(bobple);
    const [canJoin, setCanJoin] = useState(true); // 참여 가능 여부

    useEffect(() => {
        if (chatRoomImage) {
            setImage(chatRoomImage);
        } else {
            setImage(bobple);
        }

        const checkUserStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const userIdx = localStorage.getItem('userIdx');

                console.log(`Checking status for ChatRoom ID: ${chatRoomId} and User ID: ${userIdx}`);

                // 채팅방 참여자 목록에서 현재 사용자가 포함되어 있는지 확인
                const participantsResponse = await axios.get(`http://localhost:8080/api/chatrooms/${chatRoomId}/participants`, {
                    headers: {
                        'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
                    }
                });

                const participant = participantsResponse.data.find(participant => participant.userId === parseInt(userIdx));

                if (participant) {
                    console.log(`User found in ChatRoom. Status: ${participant.status}`);
                    if (participant.status === 'DENIED') {
                        setCanJoin(false);
                    }
                } else {
                    console.log('User is not a participant in this ChatRoom.');
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('User has not joined this chat room.');
                } else {
                    console.error('Failed to check user status', error);
                }
            }
        };

        checkUserStatus();
    }, [chatRoomImage, chatRoomId]);

    const moveChat = async (chatRoomId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No JWT token found');
                return;
            }

            const response = await axios.post(`http://localhost:8080/api/chatrooms/join/${chatRoomId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
                }
            });

            if (response.status === 200) {
                console.log('Successfully joined the chat room');
                navigate(`/group/chatting/${chatRoomId}`);
                hideModal();
            } else {
                console.error('Failed to join the chat room');
            }
        } catch (error) {
            console.error('Error joining the chat room', error);
        }
    };

    const closeModal = () => {
        hideModal();
    };

    return (
        <div className={`modal ${modalState}`}>
            <div className="modal-content join-content">
                <div className="group-modal-header join-header">
                    <h3 className="group-modal-title join-title">모임 참여</h3>
                    <button className="group-modal-close-btn" onClick={closeModal}>×</button>
                </div>
                <div className="group-room-container">
                    <div className="group-image-box">
                        <img src={image} alt="이미지 미리보기" className="preview-image"/>
                    </div>
                    <div className="group-text-container">
                        <h4>{chatRoomTitle}</h4>
                        <span>{currentParticipants}명 참여 중 ({chatRoomPeople}명 모집)</span>
                        <p>{chatRoomDescription}</p>
                    </div>
                </div>
                {currentParticipants >= chatRoomPeople ? (
                    <p className="group-modal-closed-msg">모집이 마감되었습니다</p>
                ) : canJoin ? (
                    <button className="group-modal-create-btn join-btn" onClick={() => moveChat(chatRoomId)}>나도 함께하기</button>
                ) : (
                    <p className="group-modal-closed-msg">해당 방에 참여할 수 없습니다.</p>
                )}
            </div>
        </div>
    );
};

JoinGroupModal.propTypes = {
    modalState: PropTypes.string.isRequired,
    hideModal: PropTypes.func.isRequired,
    chatRoomId: PropTypes.number.isRequired,
    chatRoomTitle: PropTypes.string.isRequired,
    chatRoomDescription: PropTypes.string.isRequired,
    chatRoomPeople: PropTypes.number.isRequired,
    chatRoomImage: PropTypes.string,
    currentParticipants: PropTypes.number.isRequired
};

export default JoinGroupModal;