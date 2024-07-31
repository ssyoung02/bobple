import React from 'react';
import {Route, Routes} from "react-router-dom";
import GroupMain from "../pages/eatingGroup/GroupMain";
import Chatting from "../pages/eatingGroup/chatting/Chatting";
import {ModalProvider} from "../components/modal/ModalContext";

function EatingGroupRouter(){
    return(
        <Routes>
            <Route path="/" element={
                <ModalProvider>
                    <GroupMain/>
                </ModalProvider>
                }/>
            <Route path="/chatting" element={<Chatting/>}/>
        </Routes>
    );
}

export default EatingGroupRouter;