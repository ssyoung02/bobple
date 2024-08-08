import '../../assets/style/components/ChattingModal.css'
import PropTypes from "prop-types";
import React from "react";

const ChattingModal = ({ modalState, hideModal, chatRoomTitle }) => {

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
            </div>
        </div>
    )
}

ChattingModal.propTypes = {
    modalState: PropTypes.string.isRequired,
    hideModal: PropTypes.func.isRequired,
    chatRoomTitle: PropTypes.string.isRequired,
};

export default ChattingModal;