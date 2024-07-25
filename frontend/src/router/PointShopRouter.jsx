import React from 'react';
import {Route, Routes} from "react-router-dom";
import PointMain from "../pages/pointShop/PointMain";
import PointGifticonDetail from "../pages/pointShop/PointGifticonDetail";
import MyPointPurchase from "../pages/pointShop/MyPointPurchase";
import GifticonBarcode from "../pages/pointShop/GifticonBarcode";

import PointGameMain from "../pages/pointShop/pointGames/PointGameMain";

function PointShopRouter(){
    return(
        <Routes>
            <Route path="/point" element={<PointMain/>}/>
            <Route path="/point/pointGifticonDetail" element={<PointGifticonDetail/>}/>
            <Route path="/point/myPointPurchase" element={<MyPointPurchase/>}/>
            <Route path="/point/gifticonBarcode" element={<GifticonBarcode/>}/>

            <Route path="/point/pointGames/pointGameMain" element={<PointGameMain/>}/>

        </Routes>
    );
}

export default PointShopRouter;