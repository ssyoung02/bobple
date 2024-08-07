import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import CreateGroupModal from './CreateGroupModal';
import JoinGroupModal from './JoinGroupModal';
import ChattingModal from './ChattingModal';
import ErrorModal from './ErrorModal'; // ErrorModal 추가

// Context 생성
const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState('hide');
    const [modalType, setModalType] = useState('');
    const [errorState, setErrorState] = useState('hide');
    const [errorMessage, setErrorMessage] = useState('');
    const [chatRoomData, setChatRoomData] = useState(null);

    const showModal = () => {
        setModalState('show');
    };

    const hideModal = () => {
        setModalState('hide');
    };

    const showErrorModal = (message) => {
        setErrorMessage(message);
        setErrorState('show');
    };

    const hideErrorModal = () => {
        setErrorState('hide');
        setErrorMessage('');
        showModal(); // 에러 모달을 닫을 때 모임 만들기 모달을 다시 열기
    };

    return (
        <ModalContext.Provider
            value={{ modalState, showModal, hideModal, setModalType, showErrorModal, hideErrorModal, setChatRoomData }}
        >
            {modalType === 'createGroup' && modalState === 'show' && (
                <CreateGroupModal modalState={modalState} hideModal={hideModal} />
            )}
            {modalType === 'joinGroup' && modalState === 'show' && chatRoomData && (
                <JoinGroupModal
                    modalState={modalState}
                    hideModal={hideModal}
                    chatRoomId={chatRoomData.chatRoomIdx}
                    chatRoomTitle={chatRoomData.chatRoomTitle}
                    chatRoomDescription={chatRoomData.description}
                    chatRoomPeople={chatRoomData.roomPeople}
                    chatRoomImage={chatRoomData.roomImage} // 이미지 URL 추가
                    currentParticipants={chatRoomData.currentParticipants} // 현재 참여 중인 인원 추가
                />
            )}
            {modalType === 'chatting' && modalState === 'show' && (
                <ChattingModal
                    modalState={modalState}
                    hideModal={hideModal}
                    chatRoomTitle={chatRoomData.chatRoomTitle}
                />
            )}
            {errorState === 'show' && <ErrorModal message={errorMessage} hideErrorModal={hideErrorModal} />}
            {children}
        </ModalContext.Provider>
    );
};

ModalProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useModal = () => {
    return useContext(ModalContext);
};
