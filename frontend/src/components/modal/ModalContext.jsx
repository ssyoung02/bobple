import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import GroupModal from './GroupModal';

// Context 생성
const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState("hide");

    const showModal = () => {
        setModalState("show");
    };

    const hideModal = () => {
        setModalState("hide");
    };

    return (
        <ModalContext.Provider value={{ modalState, showModal, hideModal }}>
            {modalState === "show" && <GroupModal modalState={modalState} hideModal={hideModal} />}
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
