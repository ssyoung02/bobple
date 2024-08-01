import React from 'react';
import {Route, Routes} from "react-router-dom";
import RecommendMain from "../pages/recommendFood/RecommendMain";
import RecommendFoodCategory from "../pages/recommendFood/RecommendFoodCategory"
import FoodWorldCup from "../pages/recommendFood/foodWorldCup/FoodWorldCup";

function RecommendFoodRouter(){
    return(
        <Routes>
            <Route path="/" element={<RecommendMain/>}/>
            <Route path="/recommendFoodCategory" element={<RecommendFoodCategory />}>
                <Route path=":category" element={<RecommendFoodCategory />} />
                <Route path=":keyword" element={<RecommendFoodCategory />} />
            </Route>

            <Route path="/foodWorldCup/foodWorldCup" element={<FoodWorldCup/>}/>
        </Routes>
    );
}

export default RecommendFoodRouter;