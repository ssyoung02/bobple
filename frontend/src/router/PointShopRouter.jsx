import React from 'react';
import {Route, Routes} from "react-router-dom";
import PointMain from "../pages/pointShop/PointMain";
import PointGifticonDetail from "../pages/pointShop/PointGifticonDetail";
import MyPointPurchase from "../pages/pointShop/MyPointPurchase";
import GifticonBarcode from "../pages/pointShop/GifticonBarcode";
import GachaGame from "../pages/pointShop/pointGames/randomGacha/GachaGame";

import PointGameMain from "../pages/pointShop/pointGames/PointGameMain";

function PointShopRouter(){
    return(
        <Routes>
            <Route path="/" element={<PointMain/>}/>
            <Route path="/pointGifticonDetail" element={<PointGifticonDetail/>}/>
            <Route path="/myPointPurchase" element={<MyPointPurchase/>}/>
            <Route path="/gifticonBarcode" element={<GifticonBarcode/>}/>

            <Route path="/pointGames/pointGameMain" element={<PointGameMain/>}/>
            <Route path="/pointGames/GachaGame" element={<GachaGame/>}/>

        </Routes>
    );
}

export default PointShopRouter;