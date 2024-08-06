import React from 'react';
import {Route, Routes} from "react-router-dom";
import RecommendMain from "../pages/recommendFood/RecommendMain";
import RecommendFoodCategory from "../pages/recommendFood/RecommendFoodCategory"
import FoodWorldCup from "../pages/recommendFood/foodWorldCup/FoodWorldCup";
import FoodWorldCupGame from "../pages/recommendFood/foodWorldCup/FoodWorldCupGame";

function FoodWorldCupGane() {
    return null;
}

function RecommendFoodRouter(){
    return(
        <Routes>
            <Route path="/" element={<RecommendMain/>}/>
            <Route path="/recommendFoodCategory" element={<RecommendFoodCategory />}>
                <Route path=":category" element={<RecommendFoodCategory />} />
                <Route path=":keyword" element={<RecommendFoodCategory />} />
            </Route>

            <Route path="/foodWorldCup/foodWorldCup" element={<FoodWorldCup/>}/>
            <Route path="/foodWorldCup/foodWorldCupGame" element={<FoodWorldCupGame/>}/>
        </Routes>
    );
}

export default RecommendFoodRouter;