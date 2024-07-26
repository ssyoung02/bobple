import React from 'react';
import {Route, Routes} from "react-router-dom";
import GroupMain from "../pages/eatingGroup/GroupMain";
import Chatting from "../pages/eatingGroup/chatting/Chatting";

function EatingGroupRouter(){
    return(
        <Routes>
            <Route path="/" element={GroupMain}/>

            <Route path="/chatting/chatting" element={Chatting}/>
        </Routes>
    );
}

export default EatingGroupRouter;