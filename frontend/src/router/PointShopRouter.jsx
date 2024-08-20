import React, { useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import axios from 'axios';
import PointMain from "../pages/pointShop/PointMain";
import PointGifticonDetail from "../pages/pointShop/PointGifticonDetail";
import MyPointPurchase from "../pages/pointShop/MyPointPurchase";
import GifticonBarcode from "../pages/pointShop/GifticonBarcode";
import GachaGame from "../pages/pointShop/pointGames/randomGacha/GachaGame";
import SlotMachine from "../pages/pointShop/pointGames/slotMachine/SlotMachine";
import MatchingGame from "../pages/pointShop/pointGames/matchingGame/MatchingGame";
// import PointShopForm from "../pages/pointShop/PointShopForm";
// import PointShopList from "../pages/pointShop/PointShopList";
import FruitsAvoid from "../pages/pointShop/pointGames/fruitsAvoid/FruitsAvoid";

function PointShopRouter() {
    const [pointShops, setPointShops] = useState([]);

    // useEffect(() => {
    //     const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    //     axios.get('http://localhost:8080/api/point-shops', {
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     })
    //         .then(response => {
    //             setPointShops(response.data);
    //         })
    //         .catch(error => {
    //             console.error("There was an error fetching the point shops!", error);
    //         });
    // }, []);

    return (
        <Routes>
            <Route path="/" element={<PointMain/>}/>
            <Route path="/pointGifticonDetail" element={<PointGifticonDetail/>}/>
            <Route path="/myPointPurchase" element={<MyPointPurchase/>}/>
            <Route path="/gifticonBarcode" element={<GifticonBarcode/>}/>
            <Route path="/pointGame/GachaGame" element={<GachaGame/>}/>
            <Route path="/pointGame/MatchingGame" element={<MatchingGame/>}/>
            <Route path="/pointGame/SlotGame" element={<SlotMachine/>}/>
            <Route path="/pointGame/FruitsAvoid" element={<FruitsAvoid/>}/>


        </Routes>
    );
}

export default PointShopRouter;
