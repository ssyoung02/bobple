import React from 'react';
import {Route, Routes} from "react-router-dom";
import Swallow from "../pages/mainGame/Swallow"
import Roulette from "../pages/mainGame/Roulette";

function MainGameRouter(){
    return(
        <Routes>
            <Route path="/roulette" element={<Roulette/>}/>
            <Route path="/swallow" element={<Swallow/>}/>
        </Routes>
    );
}

export default MainGameRouter;