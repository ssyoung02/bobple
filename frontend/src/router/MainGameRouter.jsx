import React from 'react';
import {Route, Routes} from "react-router-dom";
import CardGame from "../pages/mainGame/CardGame"
import Swallow from "../pages/mainGame/Swallow"

function MainGameRouter(){
    return(
        <Routes>
            <Route path="/mainGame/cardGame" element={<CardGame/>}/>
            <Route path="/mainGame/swallow" element={<Swallow/>}/>
        </Routes>
    );
}

export default MainGameRouter;