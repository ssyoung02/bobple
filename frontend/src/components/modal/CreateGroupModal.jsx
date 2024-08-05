import '../../assets/style/components/GroupModal.css';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from "axios";
import { useModal } from "./ModalContext"; // useModal import

const CreateGroupModal = ({ modalState, hideModal }) => {
    const navigate = useNavigate();
    const { showErrorModal } = useModal(); // useModal 훅 사용
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [roomPeople, setRoomPeople] = useState(1);
    const [image, setImage] = useState(null);

    const moveChat = (chatRoomId) => {
        console.log(`Navigating to /group/chatting/${chatRoomId}`);
        navigate(`/group/chatting/${chatRoomId}`);
    };

    const createChatRoom = async () => {
        if (!title.trim() || !description.trim()) {
            showErrorModal("모임제목 및 모임설명을 작성해주세요!");
            return;
        }

        const finalLocation = location.trim() || "미정";

        try {
            const token = localStorage.getItem('token'); // JWT 토큰을 로컬 스토리지에서 가져옴
            const response = await axios.post('http://localhost:8080/api/chatrooms', {
                chatRoomTitle: title,
                description: description,
                location: finalLocation,
                roomPeople: roomPeople
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201 || response.status === 200) {
                const chatRoom = response.data; // 생성된 채팅방 정보
                const chatRoomId = chatRoom.chatRoomIdx; // 생성된 chat_room_idx 받아오기
                console.log(`Chat room created with ID: ${chatRoomId}`);

                // localStorage에 채팅방 정보 저장
                localStorage.setItem('currentChatRoomId', chatRoomId);
                localStorage.setItem('currentChatRoomTitle', chatRoom.chatRoomTitle);
                localStorage.setItem('currentChatRoomDescription', chatRoom.description);
                localStorage.setItem('currentChatRoomLocation', chatRoom.location);
                localStorage.setItem('currentChatRoomPeople', chatRoom.roomPeople);
                localStorage.setItem('currentChatRoomCreatedAt', chatRoom.createdAt);
                localStorage.setItem('currentChatRoomLeader', chatRoom.roomLeader);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('file-input').click();
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
                    <div className="group-image-container">
                        <div className="group-image-box" onClick={triggerFileInput}>
                            {image ? (
                                <img src={image} alt="이미지 미리보기" className="preview-image"/>
                            ) : (
                                <div className="placeholder"></div>
                            )}
                        </div>
                        <button className="plus-button" onClick={triggerFileInput}>+</button>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input"
                            id="file-input"
                            style={{display: 'none'}} // input을 숨김
                        />
                    </div>
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

CreateGroupModal.propTypes = {
    modalState: PropTypes.string.isRequired,
    hideModal: PropTypes.func.isRequired,
};

export default CreateGroupModal;
