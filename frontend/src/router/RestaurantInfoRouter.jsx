import React from 'react';
import { Route, Routes } from "react-router-dom";
import RestaurantInfo from "../pages/restaurantInfo/RestaurantInfo"
import RestaurantReview from "../pages/restaurantInfo/RestaurantReview"

function RestaurantInfoRouter() {
    return (
        <Routes>
            <Route path="/:restaurantId" element={<RestaurantInfo />} />
            <Route path="/:restaurantId/review" element={<RestaurantReview />} />
        </Routes>
    );
}

export default RestaurantInfoRouter;
