import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import MainPage from "../pages/MainPage";
import AdminRouter from "./AdminRouter"
import AroundFoodRouter from "./AroundFoodRouter"
import EatingGroupRouter from "./EatingGroupRouter"
import MainGameRouter from "./MainGameRouter"
import MyPageRouter from "./MyPageRouter"
import PointShopRouter from "./PointShopRouter"
import RecipeRouter from "./RecipeRouter"
import RecommendFoodRouter from "./RecommendFoodRouter"
import NotFound from "../pages/NotFound";
import AllSearchRouter from "./AllSearchRouter";

function MainRouter(){
    return(
        <Routes>
            <Route path="/"  element={<MainPage/>}/>
            <Route path="/admin/*" element={<AdminRouter/>}/>
            <Route path="/around/*" element={<AroundFoodRouter/>}/>
            <Route path="/ /*" element={<EatingGroupRouter/>}/>
            <Route path="/mainGame/*" element={<MainGameRouter/>}/>
            <Route path="/myPage/*" element={<MyPageRouter/>}/>
            <Route path="/point/*" element={<PointShopRouter/>}/>
            <Route path="/recipe/*" element={<RecipeRouter/>}/>
            <Route path="/recommend/*" element={<RecommendFoodRouter/>}/>
            <Route path="/search/*" element={<AllSearchRouter/>}/>
            <Route path="*"  element={<NotFound/>}/>
        </Routes>
    );
}

export default MainRouter;