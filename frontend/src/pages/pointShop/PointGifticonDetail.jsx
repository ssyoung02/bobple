import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import '../../assets/style/PointGifticonDetail.css';

function PointGifticonDetail() {
    const location = useLocation();
    const { productIdx } = location.state;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(`Fetching product details for productIdx: ${productIdx}`);
        axios.get(`http://localhost:8080/api/PointGifticonDetail/${productIdx}`)
            .then(response => {
                console.log('API Response:', response.data);
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
                setError('상품 정보를 가져오는 중 오류가 발생했습니다.');
                setLoading(false);
            });
    }, [productIdx]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return(
        <>
            {product ? (
                <div className="product-card">
                    <img src={product.giftImageUrl} alt={product.giftDescription} className="product-image"/>
                    <div className="product-info">
                        <p className="product-brand">{product.giftBrand}</p>
                        <h3 className="product-name">{product.giftDescription}</h3>
                        <p className="product-description">⭐ 사용기한은 구매일로부터 1년입니다 ⭐</p>
                        <p className="product-points">{product.giftPoint}P</p>
                    </div>
                    <button className="purchase-button">구매하기</button>
                </div>
            ) : (
                <div>상품 정보를 찾을 수 없습니다.</div>
            )}
        </>
    );
}

export default PointGifticonDetail;
