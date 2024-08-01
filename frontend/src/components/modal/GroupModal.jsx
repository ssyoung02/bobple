import '../../assets/style/components/GroupModal.css';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from "axios";

// props로 받은 제목, 내용을 출력하는 모달
const GroupModal = ({ modalState, hideModal }) => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [roomPeople, setRoomPeople] = useState(1);

    const moveChat = (chatRoomId) => {
        console.log(`Navigating to /chatting/${chatRoomId}`);
        navigate(`/chatting/${chatRoomId}`);
    };

    const createChatRoom = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/chatrooms', {
                chatRoomTitle: title,
                description: description,
                location: location,
                roomPeople: roomPeople
            });

            if (response.status === 201 || response.status === 200 ) {
                const chatRoomId = response.data.chatRoomIdx; // 생성된 chat_room_idx 받아오기
                console.log(`Chat room created with ID: ${chatRoomId}`);
                moveChat(chatRoomId); // 해당 chat_room_idx로 채팅 페이지로 이동
                hideModal();
            } else {
                console.error(`Failed to create chat room: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to create chat room', error);
        }
    };

    const closeModal = () => {
        hideModal();
    };

    return (
        <div className={`modal ${modalState}`}>
            <div className="modal-content">
                <div className="group-modal-header">
                    <button className="group-modal-close-btn" onClick={closeModal}>×</button>
                    <h3 className="group-modal-title">모임 만들기</h3>
                    <button className="group-modal-create-btn" onClick={createChatRoom}>생성</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>모임제목</label>
                        <input
                            type="text"
                            placeholder="모임을 표현할 제목을 입력해주세요."
                            maxLength="8"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>모임설명</label>
                        <textarea
                            placeholder="모임 설명을 입력해주세요."
                            maxLength="30"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>모임장소</label>
                        <input
                            type="text"
                            placeholder="장소를 입력해주세요(미작성 시 미정)"
                            maxLength="20"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>수용 인원</label>
                        <input
                            type="number"
                            placeholder="수용 인원을 입력해주세요"
                            value={roomPeople}
                            onChange={(e) => setRoomPeople(parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

GroupModal.propTypes = {
    modalState: PropTypes.string.isRequired,
    hideModal: PropTypes.func.isRequired,
};

export default GroupModal;
