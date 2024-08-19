import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/style/pointShop/PointGifticonDetail.css';
import axios from 'axios';

function PointGifticonDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { productIdx } = location.state || {};
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userIdx = localStorage.getItem('userIdx');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (!productIdx) {
            setError('상품 정보가 제공되지 않았습니다.');
            setLoading(false);
            return;
        }

        //console.log(`Fetching product details for productIdx: ${productIdx}`);

        axios.get(`http://localhost:8080/api/PointGifticonDetail/${productIdx}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        })
            .then(response => {
                //console.log('API Response:', response.data);
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => {
                //console.error('Error fetching product details:', error);
                setError('상품 정보를 가져오는 중 오류가 발생했습니다.');
                setLoading(false);
            });
    }, [productIdx, navigate, token]);

    const handlePurchase = () => {
        if (!product) {
            alert('상품 정보를 찾을 수 없습니다.');
            return;
        }

        if (window.confirm(`${product.giftDescription} 기프티콘을 구매하시겠습니까?`)) {
            axios.post(`http://localhost:8080/api/GiftPurchase`, null, {
                params: {
                    userIdx: userIdx,
                    productIdx: product.giftIdx
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            })
                .then(response => {
                    //console.log('Purchase response:', response.data);
                    if (response.data) {
                        alert('구매가 완료되었습니다.');
                        navigate('/point', { state: { selectedTab: '보관함' } });
                    } else {
                        alert('구매에 실패하였습니다. 잔여 포인트를 확인해주세요.');
                    }
                })
                .catch(error => {
                    //console.error('Error during purchase:', error);
                    alert('구매 중 오류가 발생했습니다.');
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
                    {product.giftImageUrl && <img src={product.giftImageUrl} alt={product.giftDescription} className="product-image" />}
                    <div className="product-info">
                        <p className="product-brand">{product.giftBrand}</p>
                        <h3 className="product-name">{product.giftDescription}</h3>
                        <p className="product-description">⭐ 사용기한은 구매일로부터 1년입니다 ⭐</p>
                        <p className="product-points">{product.giftPoint}P</p>
                    </div>
                    <button className="purchase-button" onClick={handlePurchase}>구매하기</button>
                </div>
            ) : (
                <div>상품 정보를 찾을 수 없습니다.</div>
            )}
        </>
    );
}

export default PointGifticonDetail;
