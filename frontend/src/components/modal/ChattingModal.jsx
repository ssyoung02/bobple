import '../../assets/style/components/ChattingModal.css';
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const ChattingModal = ({ modalState, hideModal, chatRoomId, chatRoomTitle, chatRoomPeople }) => {
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
                <div className="chatRoom-header">
                    <h5 className="chatRoom-title">{chatRoomTitle}</h5>
                    <p>"잠금"</p>
                </div>
                <div className="chatRoom-info">
                    <h6>모임 정보</h6>
                    <br/>
                    <div>모임장소 :</div>
                    <div>모임시간 :</div>
                </div>
                <h6 className="chatRoom-people">모집 인원 {chatRoomPeople}</h6>
                <div className="participants-list">
                    {participants.length > 0 ? (
                        participants.map((participant) => (
                            <div key={participant.userId} className="participant-item">
                                <img src={participant.profileImage} alt={`${participant.name}'s profile`}
                                     className="participant-image"/>
                                <span>{participant.name}</span>
                            </div>
                        ))
                    ) : (
                        <p>No participants found</p>
                    )}
                </div>
                <div className="chatRoom-game">
                    <h6>오늘의 주인공</h6>
                    <button>제비뽑기</button>
                    <button>돌림판</button>
                </div>
                <div className="chatRoom-footer">
                    <button onClick={closeModal}>나가기➡️</button>
                    <button>정산하기️</button>
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
    chatRoomPeople: PropTypes.number.isRequired,
};

export default ChattingModal;