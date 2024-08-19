import React from 'react';
import {Route, Routes} from "react-router-dom";
import AllSearch from "../pages/alllSearch/AllSearch";
import SearchKeyword from "../pages/alllSearch/SearchKeyword";
import RecipeSearchResults from "../pages/recipe/RecipeSearchResults"; // RecipeMain 추가

function AllSearchRouter(){
    return(
        <Routes>
            <Route path="/" element={<AllSearch/>}/>
            <Route path="/SearchKeyword/:keyword" element={<SearchKeyword />} />
            <Route path="/recipe/search" element={<RecipeSearchResults />} />
        </Routes>
    );
}

export default AllSearchRouter;