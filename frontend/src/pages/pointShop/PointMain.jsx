import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/style/pointShop/PointMain.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Carousel } from 'react-bootstrap';
import stamp from '../../assets/images/checkstamp.png';

const products = [
    { id: 1, brand: '스타벅스',name: '아메리카노+케이크', category: '카페', points: 150, date: "25.08.01", image: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjA2MjFfMjA5%2FMDAxNjU1Nzc1Mzc0NjA3.ySolsq1T1eFT-1tNePelYy-q4U1G8Qec3qzk8ey-UDwg.rTQJzHzso3BzbO1fjZg_L0Y2H83LKlVgZcBXETg1sWEg.PNG.eduwillswg%2Fimage.png&type=a340' },
    { id: 2, brand: '베스킨라빈스',name: '3가지맛 파인트', category: '아이스크림', points: 120, date: "25.08.10", image: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fcafefiles.naver.net%2FMjAxOTAxMzFfMjg4%2FMDAxNTQ4OTQwMTEyNTEy.HrG6sMYYbeu_M1XProVOejC7R1odXxc4wi3w_G_9isgg.uPuecMcwNuzpcxod4_BM727_hx6Wn5cK3Bzgoy7l5oUg.JPEG.dbsgkapffhd%2Fnv_1548940110594.jpg&type=a340' },
    { id: 3, brand: '명랑핫도그',name: '감자핫도그 2개', category: '핫도그', points: 650, date: "25.08.26", image: 'https://search.pstatic.net/sunny/?src=http%3A%2F%2Ffile3.instiz.net%2Fdata%2Fcached_img%2Fupload%2F2020%2F03%2F09%2F9%2Ff230112c6eec68fdc33865cc2664e4e6.jpg&type=a340' },
    { id: 4, brand: 'CU',name: '1천원권', category: '편의점', points: 10, date: "25.08.04", image: 'https://search.pstatic.net/common/?src=http%3A%2F%2Fcafefiles.naver.net%2FMjAxNzA1MjRfMTE0%2FMDAxNDk1NTU5NzA2MzQ5.n9_ziG5nKV9lJIGb4PoIC4sb6uFn1VIQ_To9Cx0dQFEg.rx577GVQZMslWIwfcfgRu3tEHlVA3Yy-4YLp6fRGVqUg.JPEG.ca2puh25%2FexternalFile.jpg&type=a340' },
];

function PointMain() {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('기프티콘');
    const [selectedItemTab, setSelectedItemTab] = useState('보유중');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [carouselIndex, setCarouselIndex] = useState(0);

    const categories = ['전체', '카페', '아이스크림', '편의점', '핫도그', '패스트푸드'];

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleItemTabClick = (tab) => {
        setSelectedItemTab(tab);
    }

    const moveGacha = () => {
        navigate('/point/pointGame/GachaGame');
    };

    const moveSlot = () => {
        navigate('/point/pointGame/SlotGame');
    };

    const movegiftDetail = (product) => {
        navigate('/point/pointGifticonDetail', { state : {product}});
    }

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const handleCarouselSelect = (selectedIndex) => {
        setCarouselIndex(selectedIndex);
    };

    const filteredProducts = selectedCategory === '전체'
        ? products
        : products.filter(product => product.category === selectedCategory);

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
                                style={{height: "200px"}}
                                className="d-block w-100"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzm4YgqWggUVzHi8jNDtIr-i-NxLW-ZtL3tA&s"
                            />
                        </Carousel.Item>
                        <Carousel.Item className="carousel-item">
                            <img
                                style={{height: "200px", background: "#061A30"}}
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
                                <button key={product.id} className="product-item" onClick={() => movegiftDetail(product)}>
                                    <img src={product.image} alt={product.name}/>
                                    <h3>{product.brand}</h3>
                                    <h4>{product.name}</h4>
                                    <p>{product.points}P</p>
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
                        <button className="game-button" onClick={moveSlot}>slot</button>
                    </div>
                </>
            )}
            {selectedTab === '보관함' && (
                <>
                    <h3 className="item-header">사용가능한 선물이<br/>n개 남아있어요.</h3>
                    <div className="item-tabs-nav">
                        <div className="point-tab">
                            <Tab name="보유중" onClick={() => handleItemTabClick('보유중')}
                                 isActive={selectedItemTab === '보유중'}/>
                        </div>
                        <div className="point-tab">
                            <Tab name="사용완료" onClick={() => handleItemTabClick('사용완료')}
                                 isActive={selectedItemTab === '사용완료'}/>
                        </div>
                    </div>
                    {selectedItemTab === '보유중' && (
                        <>
                            <div className="item-container">
                                <div className="product-list">
                                    {filteredProducts.map(product => (
                                        <div key={product.id} className="product-item">
                                            <img src={product.image} alt={product.name}/>
                                            <h3>{product.name}</h3>
                                            <p>{product.date}까지</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    {selectedItemTab === '사용완료' && (
                        <>
                            <div className="item-container">
                                <div className="product-list-blur">
                                    {filteredProducts.map(product => (
                                        <div key={product.id} className="product-item-blur">
                                            <img src={stamp} alt="stamp" className="stamp-image"/>
                                            <img src={product.image} alt={product.name}/>
                                            <h3>{product.name}</h3>
                                            <p>{product.date}까지</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );

    function Tab({name, onClick, isActive}) {
        return (
            <button onClick={onClick} className={isActive ? 'active' : ''}>
                {name}
            </button>
        );
    }
}

export default PointMain;
