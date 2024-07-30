import React from 'react';
import {Route, Routes} from "react-router-dom";
import AllSearch from "../pages/alllSearch/AllSearch";

function AllSearchRouter(){
    return(
        <Routes>
            <Route path="/" element={<AllSearch/>}/>
        </Routes>
    );
}

export default AllSearchRouter;