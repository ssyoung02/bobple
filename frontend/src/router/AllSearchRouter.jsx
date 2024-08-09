import React from 'react';
import {Route, Routes} from "react-router-dom";
import AllSearch from "../pages/alllSearch/AllSearch";
import SearchKeyword from "../pages/alllSearch/SearchKeyword";

function AllSearchRouter(){
    return(
        <Routes>
            <Route path="/" element={<AllSearch/>}/>
            <Route path="/SearchKeyword/:keyword" element={<SearchKeyword />} />
        </Routes>
    );
}

export default AllSearchRouter;