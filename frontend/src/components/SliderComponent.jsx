import React, {useContext, useEffect, useState} from "react";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/style/components/SliderComponent.css';
import MainFoodBanner_jeon from "../assets/images/banner/MainFoodBanner_jeon.jpg"
import {restaurantfetchTopKeywords} from "./Search/RestaurantSearch"
import {Link, useNavigate, useParams} from "react-router-dom";
import {Heart, HeartLine, NextTo, PrevTo, View} from "./imgcomponents/ImgComponents";
import axios from "axios";
import useRecommendThemes from "../hooks/RecommendFoodHooks"
import RecipeContext from "../pages/recipe/RecipeContext";
import errorImage from "../assets/images/error_image.jpg";
import RecipeDetail from "../pages/recipe/RecipeDetail";

export default function SliderComponent() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 2;
    const { recommendThemes } = useRecommendThemes();

    const handleThemeClick = (theme) => {
        const themeKeyword = theme.foodNames.join(' ');
        navigate(
            `/recommend/recommendFoodCategory?theme=${themeKeyword}&themeName=${theme.themeName}`
        );
    };

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
        <div className="main-slide"> {/* 클래스 이름 변경 */}
            <SlickSlider {...settings}>
                {recommendThemes.map((theme) => (
                    <div
                        className="main-slide-item"
                        key={theme.themeIdx}
                        onClick={() => handleThemeClick(theme)}
                    >
                        <img
                            className="main-slide-item-img"
                            src={theme.themeBannerUrl}
                            alt={theme.themeDescription}
                        />
                    </div>
                ))}
            </SlickSlider>
            <div className="slider-counter">
                {currentSlide + 1} / {recommendThemes.length}
            </div>
        </div>
    );
}

export const TopSearch = ({ onKeywordClick }) => {
    const [topKeywords, setTopKeywords] = useState([]);

    useEffect(() => {
        restaurantfetchTopKeywords(setTopKeywords);
    }, []);

    const handleKeywordClick = (keyword) => {
        if (onKeywordClick) {
            onKeywordClick(keyword);
        }
    };

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
                    <span key={index} onClick={() => handleKeywordClick(keyword.keyword)}> {/* keyword.keyword 사용 */}
                        {index + 1}. {keyword.keyword}
          </span>
                ))}
            </SlickSlider>
        </div>
    );
}

export const RecommendedCategories = () => {
    const { recommendThemes, handleThemeClick } = useRecommendThemes();

    const recommendedCategoriesSettings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        draggable: true,
        swipeToSlide: true,
        centerMode: false,
        arrows: false
    };

    return (
        <div className="category-square-banner">
            <SlickSlider {...recommendedCategoriesSettings}>
                {recommendThemes.map(theme => (
                    <div className="category-square-item" key={theme.themeIdx}>
                        <button onClick={() => handleThemeClick(theme.themeIdx)}>
                            <img src={theme.themeImageUrl} alt={theme.themeDescription}/>
                        </button>
                    </div>
                ))}
            </SlickSlider>
        </div>
    );
};



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
        // { name: '뷔페', icon: images['buffet.png'] },
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

export const UserRecommendedRecipes = () => {
    const { recipeIdx } = useParams();
    const {userRecommendedRecipes, formatViewsCount} = useContext(RecipeContext);
    // const {handleLikeClick} = useContext(RecipeDetail);

    const RecipeSettings = {
        dots: false,
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        draggable: true,
        swipeToSlide: true,
        centerMode: true,
        arrows: false,
        autoplay: false,
    };

    return (
        <>
            <SlickSlider {...RecipeSettings}>
            {userRecommendedRecipes.length > 0 ? (
                userRecommendedRecipes.map(recipe => (
                    <div key={recipe.recipeIdx} recipe={recipe} className="recipe-card-item">
                            <div className="user-recommended-recipe-card">
                                <div className="user-recipe-card-user">
                                    <div className="user-recipe-card-user-left">
                                        <div className="recipe-user-profile">
                                            <img src={recipe.profileImage || '/images/default_avatar.jpg'}
                                                 alt={recipe.author}/>
                                        </div>
                                        <p className="author">{recipe.nickname}</p>
                                    </div>
                                    <div className="recipe-like" >
                                        <button className={`recipe-like-button ${recipe.liked ? 'liked' : ''}`}>
                                            {recipe.liked ? <Heart/> : <HeartLine/>}
                                        </button>
                                        {formatViewsCount(recipe.likesCount)}
                                    </div>

                                </div>
                                <Link className="user-recommended-recipe-link" to={`/recipe/${recipe.recipeIdx}`}>
                                <div className="user-recommended-recipe-card-image">
                                    <img src={recipe.picture || '/images/default_recipe_image.jpg'} alt={recipe.title}
                                             onError={(e) => {
                                                 e.target.onerror = null;
                                                 e.target.src = errorImage;
                                             }}/>
                                        <span className="recipe-view">
                                            <View/>
                                            {formatViewsCount(recipe.viewsCount)}
                                        </span>
                                    </div>
                                    <div className="user-recommended-recipe-card-content">
                                        <h6>{recipe.title}</h6>
                                        <p className="description">{recipe.description}</p>
                                    </div>
                                </Link>
                            </div>
                    </div>
                ))
            ) : (
                <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
            )}
            </SlickSlider>
        </>
    );
};
