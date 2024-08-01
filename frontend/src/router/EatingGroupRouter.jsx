import React from 'react';
import {Route, Routes} from "react-router-dom";
import GroupMain from "../pages/eatingGroup/GroupMain";
import GroupChatting from "../pages/eatingGroup/chatting/GroupChatting";
import {ModalProvider} from "../components/modal/ModalContext";

function EatingGroupRouter(){
    return(
        <Routes>
            <Route path="/" element={
                <ModalProvider>
                    <GroupMain/>
                </ModalProvider>
                }/>
            <Route path="/chatting" element={<GroupChatting/>}/>
        </Routes>
    );
}

export default EatingGroupRouter;