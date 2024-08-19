import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/style/pointShop/PointGifticonDetail.css';

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

        axios.get(`http://localhost:8080/api/GifticonBarcode/${productIdx}`, {
            params: { userIdx },
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        })
            .then(response => {
                //console.log('API Response:', response.data);
                //console.log('Purchase Date:', response.data.purchaseDate); // 추가된 부분
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => {
                //console.error('Error fetching product details:', error);
                setError('상품 정보를 가져오는 중 오류가 발생했습니다.');
                setLoading(false);
            });
    }, [productIdx, userIdx, token, navigate]);

    const handleUse = () => {
        if (!product) {
            alert('상품 정보를 찾을 수 없습니다.');
            return;
        }

        if (window.confirm(`${product.pointShop.giftDescription} 기프티콘을 사용하시겠습니까?`)) {
            axios.post(`http://localhost:8080/api/GiftUse`, null, {
                params: {
                    userIdx: userIdx,
                    productIdx: product.pointShop.giftIdx
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            })
                .then(response => {
                    //console.log('Use response:', response.data);
                    if (response.data) {
                        alert('기프티콘 사용이 완료되었습니다.');
                        navigate('/point', { state: { selectedTab: '보관함' } });
                    } else {
                        alert('기프티콘 사용에 실패하였습니다.');
                    }
                })
                .catch(error => {
                    //console.error('Error during use:', error);
                    alert('사용 중 오류가 발생했습니다.');
                });
        }
    };

    // 만료 날짜 및 남은 날짜 계산 함수
    const calculateExpirationDate = (purchaseDate) => {
        if (!purchaseDate) return "알 수 없음";

        const purchase = new Date(purchaseDate);  // 날짜를 파싱합니다.

        if (isNaN(purchase.getTime())) {
            //console.error("Invalid date format:", purchaseDate);
            return "유효하지 않은 날짜 형식";
        }

        const expiration = new Date(purchase);
        expiration.setFullYear(expiration.getFullYear() + 1);  // 1년 후의 날짜를 계산합니다.

        const today = new Date();
        const timeDiff = expiration.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        const year = expiration.getFullYear();
        const month = expiration.getMonth() + 1;  // 월은 0부터 시작하므로 +1
        const day = expiration.getDate();

        return `${year}년 ${month}월 ${day}일까지 D-${daysLeft}일 남았습니다`;
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
                    {product.pointShop.giftBarcodeUrl && <img src={product.pointShop.giftBarcodeUrl} alt={product.pointShop.giftDescription} className="product-image" />}
                    <div className="product-info">
                        <p className="product-brand">{product.pointShop.giftBrand}</p>
                        <h3 className="product-name">{product.pointShop.giftDescription}</h3>
                        <p className="product-description">⭐ 사용기한: {calculateExpirationDate(product.purchaseDate)} ⭐</p>
                        <p className="product-points">{product.pointShop.giftPoint}P</p>
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
