import React from 'react';
import {Route, Routes} from "react-router-dom";
import RecommendMain from "../pages/recommendFood/RecommendMain";
import RecommendFoodCategory from "../pages/recommendFood/RecommendFoodCategory";
import FoodWorldCup from "../pages/recommendFood/foodWorldCup/FoodWorldCup";

function RecommendFoodRouter(){
    return(
        <Routes>
            <Route path="/recommend" element={<RecommendMain/>}/>
            <Route path="/recommend/recommendFoodCategory" element={<RecommendFoodCategory/>}/>
            <Route path="/recommend/foodWorldCup/foodWorldCup" element={<FoodWorldCup/>}/>
        </Routes>
    );
}

export default RecommendFoodRouter;