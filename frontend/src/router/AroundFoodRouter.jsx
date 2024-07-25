import React from 'react';
import {Route, Routes} from "react-router-dom";
import AroundMain from"../pages/aroundFood/AroundMain"

function AroundFoodRouter(){
    return(
        <Routes>
            <Route path="around" element={<AroundMain/>}/>
        </Routes>
    );
}

export default AroundFoodRouter;