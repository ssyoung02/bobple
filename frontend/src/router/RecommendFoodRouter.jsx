import React from 'react';
import {Route, Routes} from "react-router-dom";
import RecommendMain from "../pages/recommendFood/RecommendMain";
import RecommendFoodCategory from "../pages/recommendFood/RecommendFoodCategory"
import FoodWorldCup from "../pages/recommendFood/foodWorldCup/FoodWorldCup";
import FoodWorldCupGame from "../pages/recommendFood/foodWorldCup/FoodWorldCupGame";
import RestaurantInfoRouter from "./RestaurantInfoRouter";

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
            {/* RestaurantInfoRouter 중첩 라우팅, 경로를 /recommend/restaurant으로 시작하도록 수정 */}
            <Route path="/restaurant/*" element={<RestaurantInfoRouter />} />

            <Route path="/foodWorldCup/foodWorldCup" element={<FoodWorldCup/>}/>
            <Route path="/foodWorldCup/foodWorldCupGame" element={<FoodWorldCupGame/>}/>
        </Routes>
    );
}

export default RecommendFoodRouter;