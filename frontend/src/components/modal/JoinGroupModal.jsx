import '../../assets/style/components/GroupModal.css';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import bobple from '../../assets/images/bobple_mascot.png';

const JoinGroupModal = ({ modalState, hideModal, chatRoomId, chatRoomTitle, chatRoomDescription, chatRoomPeople }) => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);

    const moveChat = (chatRoomId) => {
        console.log(`Navigating to /group/chatting/${chatRoomId}`);
        navigate(`/group/chatting/${chatRoomId}`);
        hideModal();
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
                        {image ? (
                            <img src={image} alt="이미지 미리보기" className="preview-image"/>
                        ) : (
                            <div className="placeholder default-image">
                                <img src={bobple} alt="기본 이미지" />
                            </div>
                        )}
                    </div>
                    <div className="group-text-container">
                        <h3>{chatRoomTitle}</h3>
                        <h5>{chatRoomPeople}명 참여중</h5>
                        <p>{chatRoomDescription}</p>
                    </div>
                </div>
                <button className="group-modal-create-btn join-btn" onClick={() => moveChat(chatRoomId)}>나도 함께하기</button>
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
};

export default JoinGroupModal;
