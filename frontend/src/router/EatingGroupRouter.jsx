// src/router/EatingGroupRouter.js
import React from 'react';
import { Route, Routes } from "react-router-dom";
import GroupMain from "../pages/eatingGroup/GroupMain";
import GroupChatting from "../pages/eatingGroup/chatting/GroupChatting";
import { ModalProvider } from "../components/modal/ModalContext";

function EatingGroupRouter() {
    return (
        <ModalProvider>
            <Routes>
                <Route path="/" element={<GroupMain />} />
                <Route path="/chatting/:chatRoomId" element={<GroupChatting />} />
            </Routes>
        </ModalProvider>
    );
}

export default EatingGroupRouter;
