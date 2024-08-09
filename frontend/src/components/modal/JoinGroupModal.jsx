import '../../assets/style/components/GroupModal.css';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import bobple from '../../assets/images/bobple_mascot.png';
import axios from 'axios';

const JoinGroupModal = ({ modalState, hideModal, chatRoomId, chatRoomTitle, chatRoomDescription, chatRoomPeople, chatRoomImage, currentParticipants }) => {
    const navigate = useNavigate();
    const [image, setImage] = useState(bobple);

    useEffect(() => {
        if (chatRoomImage) {
            setImage(chatRoomImage);
        } else {
            setImage(bobple);
        }
    }, [chatRoomImage]);

    const moveChat = async (chatRoomId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No JWT token found');
                return;
            }

            const response = await axios.post(`http://localhost:8080/api/chatrooms/join/${chatRoomId}`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
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
                        <h3>{chatRoomTitle}</h3>
                        <h5>{currentParticipants}명 참여 중 ({chatRoomPeople}명 모집)</h5>
                        <p>{chatRoomDescription}</p>
                    </div>
                </div>
                {currentParticipants >= chatRoomPeople ? (
                    <p className="group-modal-closed-msg">모집이 마감되었습니다</p>
                ) : (
                    <button className="group-modal-create-btn join-btn" onClick={() => moveChat(chatRoomId)}>나도 함께하기</button>
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
