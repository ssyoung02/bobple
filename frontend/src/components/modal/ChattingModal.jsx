import '../../assets/style/components/ChattingModal.css';
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const ChattingModal = ({ modalState, hideModal, chatRoomId, chatRoomTitle }) => {
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const token = localStorage.getItem('token'); // JWT 토큰을 로컬 스토리지에서 가져옴
                if (!token) {
                    console.error('No JWT token found');
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/chatrooms/${chatRoomId}/participants`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setParticipants(response.data);
            } catch (error) {
                console.error('Failed to fetch participants', error);
            }
        };

        fetchParticipants();
    }, [chatRoomId]);

    const closeModal = () => {
        setTimeout(() => {
            hideModal();
        }, 500);
    };

    return (
        <div className={`modal ${modalState}`}>
            <div className="modal-content chatting">
                <button onClick={closeModal}>X</button>
                <h3>{chatRoomTitle}</h3>
                <div className="participants-list">
                    {participants.length > 0 ? (
                        participants.map((participant) => (
                            <div key={participant.userId} className="participant-item">
                                <img src={participant.profileImage} alt={`${participant.name}'s profile`} className="participant-image" />
                                <span>{participant.name}</span>
                            </div>
                        ))
                    ) : (
                        <p>No participants found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

ChattingModal.propTypes = {
    modalState: PropTypes.string.isRequired,
    hideModal: PropTypes.func.isRequired,
    chatRoomId: PropTypes.number.isRequired,
    chatRoomTitle: PropTypes.string.isRequired,
};

export default ChattingModal;
