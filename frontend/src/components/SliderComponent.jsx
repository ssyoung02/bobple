import React, {useEffect, useState} from "react";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/style/components/SliderComponent.css';
import MainFoodBanner_jeon from "../assets/images/banner/MainFoodBanner_jeon.jpg"
import {fetchTopKeywords} from "./Search/SearchAll";
import {useNavigate} from "react-router-dom";
import {NextTo, PrevTo} from "./imgcomponents/ImgComponents";

export default function SliderComponent() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 2;

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        pauseOnHover: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (current) => setCurrentSlide(current)
    };
    return (
        <div className={"MainSlide"}>
            <SlickSlider {...settings}>
                <div className={"MainslideItem"}>
                    <img className={"MainslideItemImg"} src={MainFoodBanner_jeon} alt={"비오는 날엔 전이지"}/>
                    <h3 className={"MainslideItemTitle"}>비오는 날엔 전이지</h3>
                </div>
                <div className={"MainslideItem"}>
                    <img className={"MainslideItemImg"} src={MainFoodBanner_jeon} alt={"비오는 날엔 전이지"}/>
                    <span className={"MainslideItemTitle"}>비오는 날엔 전이지</span>
                </div>
            </SlickSlider>
            <div className="slider-counter">
                {currentSlide + 1} / {totalSlides}
            </div>
        </div>
    );
}

export const TopSearch = () => {
    const [topKeywords, setTopKeywords] = useState([]);

    useEffect(() => {
        fetchTopKeywords(setTopKeywords);
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 100,
        pauseOnHover: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        row: 1,
        autoplay: true,
        vertical: true
    };

    return (
        <div className={"real-time-popularity"}>
            <h6>실시간 인기</h6>
            <SlickSlider {...settings}>
                {topKeywords.map((keyword, index) => (
                    <div key={index}>{index + 1}. {keyword.keyword}</div>
                ))}
            </SlickSlider>
        </div>
    );
}

export const RecommendedCategories = () => {

    var recommendedCategoriesSettings = {
        dots: false,
        centerMode: true,
        infinite: true,
        slidesToShow: 8,
        slidesToScroll: 1,
        arrows: true,
        draggable: true,
        swipeToSlide: true,
    };

    return (
        <div className="category-description">
            <SlickSlider {...recommendedCategoriesSettings}>
                <button className={"category-description-item"}>
                    <div className={"category-description-img"}>
                        칼칼
                    </div>
                </button>
                <button className={"category-description-item"}>
                    <div className={"category-description-img"}>
                        부장님은 느끼한 게 싫다고 하셨어
                    </div>
                </button>
                <button className={"category-description-item"}>
                    <div className={"category-description-img"}>
                        부장님은 느끼한 게 싫다고 하셨어
                    </div>
                </button>
            </SlickSlider>
        </div>
    );
}

export const FoodCategories = () => {
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const navigate = useNavigate();

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        navigate(`/recommend/recommendFoodCategory?category=${category}`);
    };

    //아이콘 이미지 가져오기
    const importAll = (r) => {
        let images = {};
        r.keys().forEach((item, index) => {
            images[item.replace('./', '')] = r(item);
        });
        return images;
    };

    const images = importAll(require.context('../assets/images/icon', false, /\.(png|jpe?g|svg)$/));

    const categories = [
        { name: '전체', icon: images['meal.png'] },
        { name: '한식', icon: images['food.png'] },
        { name: '중식', icon: images['buns.png'] },
        { name: '일식', icon: images['ramen.png'] },
        { name: '양식', icon: images['spaghetti.png'] },
        { name: '패스트푸드', icon: images['burger.png'] },
        { name: '분식', icon: images['tteok.png'] },
        { name: '치킨', icon: images['fried-chicken.png'] },
        { name: '피자', icon: images['pizza.png'] },
        { name: '아시아음식', icon: images['lantern.png'] },
        { name: '뷔페', icon: images['buffet.png'] },
        { name: '도시락', icon: images['bento.png'] },
    ];


    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 10,
        slidesToScroll: 1,
        draggable: true,
        swipeToSlide: true,
        centerMode: false
    };

    return (
        <div className={"food-categories-banner"}>
            <SlickSlider {...settings}>
            {categories.map((category) => (
                <button
                    key={category.name}
                    className={`recommend-category-button ${selectedCategory === category.name ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.name)} // Link 대신 onClick 사용
                >
                    <img src={category.icon} alt={category.name} className="category-icon"/>
                    {category.name}
                </button>
            ))}
            </SlickSlider>
        </div>
    );
}