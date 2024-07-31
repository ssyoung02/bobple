import React from 'react';
import {Route, Routes} from "react-router-dom";
import PointMain from "../pages/pointShop/PointMain";
import PointGifticonDetail from "../pages/pointShop/PointGifticonDetail";
import MyPointPurchase from "../pages/pointShop/MyPointPurchase";
import GifticonBarcode from "../pages/pointShop/GifticonBarcode";
import GachaGame from "../pages/pointShop/pointGames/randomGacha/GachaGame";
import SlotMachine from "../pages/pointShop/pointGames/slotMachine/SlotMachine";

function PointShopRouter(){
    return(
        <Routes>
            <Route path="/" element={<PointMain/>}/>
            <Route path="/pointGifticonDetail" element={<PointGifticonDetail/>}/>
            <Route path="/myPointPurchase" element={<MyPointPurchase/>}/>
            <Route path="/gifticonBarcode" element={<GifticonBarcode/>}/>
            <Route path="/pointGame/GachaGame" element={<GachaGame/>}/>
            <Route path="/pointGame/SlotGame" element={<SlotMachine/>}/>

        </Routes>
    );
}

export default PointShopRouter;