import '../../assets/style/components/GroupModal.css';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import React, {useEffect, useState} from 'react';
import axios from "axios";
import bobple from '../../assets/images/bobple_mascot.png';



// props로 받은 제목, 내용을 출력하는 모달
const JoinGroupModal = ({ modalState, hideModal }) => {
    const navigate = useNavigate();
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
                        <h3>제목</h3>
                        <h5>n명 참여중</h5>
                        <p>내용</p>
                    </div>
                </div>
                {/*여기 안에 내용 데이터값 집어넣어주세용*/}
                <button className="group-modal-create-btn join-btn" onClick={createChatRoom}>나도 함께하기</button>
            </div>
        </div>
    );
};

JoinGroupModal.propTypes = {
    modalState: PropTypes.string.isRequired,
    hideModal: PropTypes.func.isRequired,
};

export default JoinGroupModal;
