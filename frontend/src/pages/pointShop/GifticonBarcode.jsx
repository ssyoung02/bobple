import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import '../../assets/style/PointGifticonDetail.css';

function PointGifticonDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { productIdx } = location.state;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userIdx = 9; // 여기에 실제 userIdx를 설정하세요

    useEffect(() => {
        console.log(`Fetching product details for productIdx: ${productIdx}`);
        axios.get(`http://localhost:8080/api/GifticonBarcode/${productIdx}`)
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

    const handleUse = () => {
        if (window.confirm(`${product.giftDescription} 기프티콘을 사용하시겠습니까?`)) {
            axios.post(`http://localhost:8080/api/GiftUse`, null, {
                params: {
                    userIdx: userIdx,
                    productIdx: product.giftIdx
                }
            })
                .then(response => {
                    console.log('Purchase response:', response.data);
                    if(response.data) {
                        alert('기프티콘 사용이 완료되었습니다.');
                        navigate('/point', { state: { selectedTab: '보관함' } });
                    } else {
                        alert('기프티콘 사용에 실패하였습니다.');
                    }
                })
                .catch(error => {
                    console.error('Error during purchase:', error);
                    alert('사용 중 오류가 발생했습니다.');
                });
        }
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            {product ? (
                <div className="product-card">
                    {product.giftBarcodeUrl && <img src={product.giftBarcodeUrl} alt={product.giftDescription} className="product-image" />}
                    <div className="product-info">
                        <p className="product-brand">{product.giftBrand}</p>
                        <h3 className="product-name">{product.giftDescription}</h3>
                        <p className="product-description">⭐ 사용기한은 구매일로부터 1년입니다 ⭐</p>
                        <p className="product-points">{product.giftPoint}P</p>
                    </div>
                    <button className="purchase-button" onClick={handleUse}>사용하기</button>
                </div>
            ) : (
                <div>상품 정보를 찾을 수 없습니다.</div>
            )}
        </>
    );
}

export default PointGifticonDetail;
