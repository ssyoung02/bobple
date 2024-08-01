import React from 'react';
import { useLocation } from "react-router-dom";
import '../../assets/style/pointShop/PointGifticonDetail.css'

function PointGifticonDetail() {
    const location = useLocation();
    const { product } = location.state;

    return(
        <>
            <div className="product-card">
                <img src={product.image} alt={product.name} className="product-image"/>
                <div className="product-info">
                    <p className="product-brand">{product.brand}</p>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">⭐ 사용기한은 구매일로부터 1년입니다 ⭐</p>
                    <p className="product-points">{product.points}P</p>
                </div>
                <button className="purchase-button">구매하기</button>
            </div>
        </>
    );
}

export default PointGifticonDetail;