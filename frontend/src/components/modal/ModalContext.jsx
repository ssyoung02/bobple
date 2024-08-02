import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import CreateGroupModal from './CreateGroupModal';
import JoinGroupModal from "./JoinGroupModal";

// Context 생성
const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState("hide");
    const [modalType, setModalType] = useState('');

    const showModal = () => {
        setModalState("show");
    };

    const hideModal = () => {
        setModalState("hide");
    };

    return (
        <ModalContext.Provider value={{ modalState, showModal, hideModal, setModalType }}>
            {modalType === 'createGroup' &&
                <CreateGroupModal modalState={modalState} hideModal={hideModal} />
            }
            {modalType === 'joinGroup' &&
                <JoinGroupModal modalState={modalState} hideModal={hideModal} />
            }
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
