import React, {useCallback, useContext, useEffect, useState, useRef} from "react";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/style/components/SliderComponent.css';
import axios from '../utils/axios';
import MainFoodBanner_jeon from "../assets/images/banner/MainFoodBanner_jeon.jpg"
import {restaurantfetchTopKeywords} from "./Search/RestaurantSearch"
import {Link, useNavigate, useParams} from "react-router-dom";
import {Heart, HeartLine, NextTo, PrevTo, View} from "./imgcomponents/ImgComponents";
// import axios from "axios";
import useRecommendThemes from "../hooks/RecommendFoodHooks"
import RecipeContext from "../pages/recipe/RecipeContext";
import mascot from "../assets/images/bobple_mascot.png";
import RecipeDetail from "../pages/recipe/RecipeDetail";
import { ClipLoader } from "react-spinners"; // 로딩 스피너 추가

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
    // const { recipeIdx } = useParams();
    // const {userRecommendedRecipes} = useContext(RecipeContext);
    // // const {handleLikeClick} = useContext(RecipeDetail);

    const [page, setPage] = useState(0); // 현재 페이지 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [recipes, setRecipes] = useState([]); // 로드된 레시피 상태
    const [hasMore, setHasMore] = useState(true); // 추가 데이터를 로드할 수 있는지 여부
    const {setError} = useContext(RecipeContext);
    const sliderRef = useRef(null); // 슬라이더 참조

    // 레시피 데이터를 가져오는 함수
    const fetchRecipes = useCallback(async (currentPage, refresh = false) => {
        setLoading(true);
        try {
            let updatedRecipes = [];
            if (currentPage === 0 && !refresh) {
                const cachedRecipes = localStorage.getItem('recommendedRecipes');
                if (cachedRecipes) {
                    setRecipes(JSON.parse(cachedRecipes));
                    setLoading(false);
                    return;
                }
            }

            const response = await axios.get('/api/recipes/recommended', {
                params: { page: currentPage, size: 10 }
            });

            if (response.data.length > 0) {
                updatedRecipes = refresh ? response.data : [...recipes, ...response.data];
                setRecipes(updatedRecipes);

                if (currentPage === 0) {
                    localStorage.setItem('recommendedRecipes', JSON.stringify(updatedRecipes));
                }

                // 새 데이터가 추가된 경우 슬라이드 인덱스를 조정하여 자연스럽게 이어지도록 함
                if (!refresh && sliderRef.current) {
                    const nextSlideIndex = recipes.length; // 새로 추가된 첫 슬라이드로 이동
                    setTimeout(() => sliderRef.current.slickGoTo(nextSlideIndex), 0);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('추천 레시피를 불러오는 중 오류가 발생했습니다:', error);
            setError('추천 레시피를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [recipes, setError]);

    useEffect(() => {
        fetchRecipes(page);

        // 5분마다 데이터 갱신 (5분 = 300000ms)
        const intervalId = setInterval(() => {
            fetchRecipes(0, true);  // 첫 페이지의 데이터를 새로 가져와 캐시 갱신
        }, 300000);

        return () => clearInterval(intervalId);  // 컴포넌트 언마운트 시 인터벌 정리
    }, [page]);


    const handleLikeClick = useCallback(async (recipeIdx) => {
        try {
            await axios.post(`/api/recipes/${recipeIdx}/like`); // 사용자 ID를 요청에 포함하지 않음
            // 캐시 무효화 (또는 갱신)
            localStorage.removeItem('recommendedRecipes');

            // 좋아요 상태와 좋아요 수 업데이트
            setRecipes(prevRecipes =>
                prevRecipes.map(recipe =>
                    recipe.recipeIdx === recipeIdx
                        ? { ...recipe, liked: !recipe.liked, likesCount: recipe.liked ? recipe.likesCount - 1 : recipe.likesCount + 1 }
                        : recipe
                )
            );
        } catch (error) {
            setError(error.message || '좋아요 처리 중 오류가 발생했습니다.');
            console.error('좋아요 처리 중 오류가 발생했습니다:', error);

        }
    }, [setError]);



    const handleSlideChange = (currentSlide) => {
        if (currentSlide === recipes.length - 1 && hasMore && !loading) {
            setPage(prevPage => prevPage + 1); // 다음 페이지로 이동
        }
    };


    const RecipeSettings = {
        dots: false,
        infinite: true, // 슬라이드가 끝에 도달하면 처음으로 돌아가는 설정
        slidesToShow: 2,
        slidesToScroll: 1,
        draggable: true,
        swipeToSlide: true,
        centerMode: true,
        arrows: false,
        autoplay:true,
        afterChange: handleSlideChange // 슬라이드 변경 후 호출
    };

    return (
        <>
            <SlickSlider ref={sliderRef} {...RecipeSettings}>
                {recipes.length > 0 ? (
                    recipes.map(recipe => (
                    <div key={recipe.recipeIdx} className="recipe-card-item">
                            <div className="user-recommended-recipe-card">
                                <div className="user-recipe-card-user">
                                    <div className="user-recipe-card-user-left">
                                        <div className="recipe-user-profile">
                                            <img src={recipe.profileImage || mascot}
                                                 alt={recipe.author}/>
                                        </div>
                                        <p className="author">{recipe.nickname}</p>
                                    </div>
                                    <div className="recipe-like" >
                                        <button className="recipe-like-button"
                                                onClick={() => handleLikeClick(recipe.recipeIdx)}>
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
                                                 e.target.src = mascot;
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
                <div className="no-recipes-message"></div>
            )}
            </SlickSlider>
            {loading && (
                <div className="loading-spinner slider">
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                </div>
            )}        </>
    );
};
