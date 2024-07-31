import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/style/PointMain.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Carousel } from 'react-bootstrap';

function PointMain() {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('기프티콘');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [products, setProducts] = useState([]);

    const categories = ['전체', '카페', '치킨', '햄버거', '피자', '편의점'];

    useEffect(() => {
        axios.get('http://localhost:8080/api/PointMain', { withCredentials: true })
            .then(response => {
                console.log(response.data); // 데이터 구조 확인
                setProducts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
            });
    }, []);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const moveGacha = () => {
        navigate('/point/pointGame/GachaGame');
    };

    const movegiftDetail = (productIdx) => {
        navigate('/point/pointGifticonDetail', { state: { productIdx } });
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleCarouselSelect = (selectedIndex) => {
        setCarouselIndex(selectedIndex);
    };

    const filteredProducts = selectedCategory === '전체'
        ? products
        : products.filter(product => product.giftCategory === selectedCategory);

    return (
        <>
            <div className="point-tabs-nav">
                <div className="point-tab">
                    <Tab name="기프티콘" onClick={() => handleTabClick('기프티콘')} isActive={selectedTab === '기프티콘'} />
                </div>
                <div className="point-tab">
                    <Tab name="게임" onClick={() => handleTabClick('게임')} isActive={selectedTab === '게임'} />
                </div>
                <div className="point-tab">
                    <Tab name="보관함" onClick={() => handleTabClick('보관함')} isActive={selectedTab === '보관함'} />
                </div>
            </div>
            {selectedTab === '기프티콘' && (
                <>
                    <Carousel fade activeIndex={carouselIndex} onSelect={handleCarouselSelect}
                              className="carousel-container">
                        <Carousel.Item className="carousel-item">
                            <img
                                style={{ height: "200px" }}
                                className="d-block w-100"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzm4YgqWggUVzHi8jNDtIr-i-NxLW-ZtL3tA&s"
                            />
                        </Carousel.Item>
                        <Carousel.Item className="carousel-item">
                            <img
                                style={{ height: "200px", background: "#061A30" }}
                                className="d-block w-100"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgiWFkbE8ddrIx5ngWQOG1iqB1H0eRh6w6iw&s"
                            />
                        </Carousel.Item>
                    </Carousel>

                    <div className="category-btn-container">
                        <div className="category-buttons">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={selectedCategory === category ? 'active' : ''}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="category-container">
                        <div className="product-list">
                            {filteredProducts.map(product => (
                                // 버튼의 onClick 핸들러 업데이트
                                <button key={product.giftIdx} className="product-item" onClick={() => movegiftDetail(product.giftIdx)}>
                                    <img src={product.giftImageUrl} alt={product.giftDescription} />
                                    <h3>{product.giftBrand}</h3>
                                    <h4>{product.giftDescription}</h4>
                                    <p>{product.giftPoint}P</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
            {selectedTab === '게임' && (
                <>
                    <h2 className="game-header">포인트 게임</h2>
                    <div className="game-container">
                        <button className="game-button" onClick={moveGacha}>Gacha</button>
                        <button className="game-button" onClick={moveGacha}>matching</button>
                        <button className="game-button" onClick={moveGacha}>avoid</button>
                        <button className="game-button" onClick={moveGacha}>slot</button>
                    </div>
                </>
            )}
            {selectedTab === '보관함' && (
                <>
                    <div className="category-btn-container">
                        <div className="category-buttons">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={selectedCategory === category ? 'active' : ''}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="category-container">
                        <div className="product-list">
                            {filteredProducts.map(product => (
                                <div key={product.giftIdx} className="product-item">
                                    <img src={product.giftImageUrl} alt={product.giftDescription} />
                                    <h3>{product.giftDescription}</h3>
                                    <p>{product.giftPoint}P</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );

    function Tab({ name, onClick, isActive }) {
        return (
            <button onClick={onClick} className={isActive ? 'active' : ''}>
                {name}
            </button>
        );
    }
}

export default PointMain;
