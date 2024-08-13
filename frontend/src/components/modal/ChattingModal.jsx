import '../../assets/style/components/ChattingModal.css';
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ChattingModal = ({ modalState, hideModal, chatRoomId, chatRoomTitle, chatRoomPeople }) => {
    const [participants, setParticipants] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchParticipantsAndRole = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No JWT token found');
                    return;
                }

                // 현재 유저 정보 가져오기
                const userResponse = await axios.get('http://localhost:8080/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const userIdx = userResponse.data.userIdx;

                // 해당 채팅방 참여자 정보 가져오기
                const participantsResponse = await axios.get(`http://localhost:8080/api/chatrooms/${chatRoomId}/participants`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // 차단된 참여자들을 제외
                const activeParticipants = participantsResponse.data.filter(participant => participant.status !== 'DENIED');
                setParticipants(activeParticipants);

                // 현재 유저의 역할 가져오기
                const roleResponse = await axios.get(`http://localhost:8080/api/chatrooms/${chatRoomId}/role`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        userIdx
                    }
                });

                console.log('Current User Role:', roleResponse.data.role); // 콘솔에 현재 유저의 역할 출력
                setCurrentUserRole(roleResponse.data.role);

            } catch (error) {
                console.error('Failed to fetch participants or user role', error);
            }
        };

        fetchParticipantsAndRole();
    }, [chatRoomId]);

    const closeModal = () => {
        setTimeout(() => {
            hideModal();
        }, 500);
    };

    const moveCal = () => {
        navigate('/myPage/calculator');
    };

    const handleBlockUser = async (userId, userName) => {
        const confirmed = window.confirm(`${userName}님을 차단하시겠습니까?\n차단하면 차단한 사용자는 다시 현재 채팅방에 들어올 수 없습니다.`);
        if (confirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.post(`http://localhost:8080/api/chatrooms/${chatRoomId}/block`, null, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        userId
                    }
                });
                setParticipants(prevParticipants => prevParticipants.filter(participant => participant.userId !== userId));
                alert(`${userName}님이 차단되었습니다.`);
            } catch (error) {
                console.error('Failed to block user', error);
            }
        }
    };

    const handleDeleteChatRoom = async () => {
        const confirmed = window.confirm('정말 이 채팅방을 삭제하시겠습니까? 모든 데이터가 삭제됩니다.');
        if (confirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/chatrooms/${chatRoomId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert('채팅방이 삭제되었습니다.');
                closeModal();
                navigate('/group');
            } catch (error) {
                console.error('Failed to delete chat room', error);
            }
        }
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
                    <br />
                    <div>모임장소 :</div>
                    <div>모임시간 :</div>
                </div>
                <h6 className="chatRoom-people">모집 인원 {chatRoomPeople}</h6>
                <div className="participants-list">
                    {participants.length > 0 ? (
                        participants.map((participant) => (
                            <div key={participant.userId} className={`participant-item ${participant.role === 'LEADER' ? 'leader' : ''}`}>
                                <img src={participant.profileImage} alt={`${participant.name}'s profile`} className="participant-image" />
                                <span>{participant.name}</span>
                                {currentUserRole === 'LEADER' && participant.role !== 'LEADER' && (
                                    <button className="block-button" onClick={() => handleBlockUser(participant.userId, participant.name)}>차단</button>
                                )}
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
                    <button onClick={moveCal}>정산하기️</button>
                    {currentUserRole === 'LEADER' && (
                        <button className="delete-button" onClick={handleDeleteChatRoom}>삭제</button>
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
    chatRoomPeople: PropTypes.number.isRequired,
};

export default ChattingModal;
