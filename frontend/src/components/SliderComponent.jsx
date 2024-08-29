import React, {useCallback, useContext, useEffect, useState, useRef} from "react";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/style/components/SliderComponent.css';
import axios from '../utils/axios'; // 커스텀 axios 인스턴스를 불러옴
import {restaurantfetchTopKeywords} from "./Search/RestaurantSearch"
import {Link, useNavigate, useParams} from "react-router-dom"; // 페이지 네비게이션 관련 모듈
import {Down, Heart, HeartLine, NextTo, PrevTo, Up, View} from "./imgcomponents/ImgComponents";
import useRecommendThemes from "../hooks/RecommendFoodHooks"
import RecipeContext from "../pages/recipe/RecipeContext"; // 레시피 관련 컨텍스트
import mascot from "../assets/images/bobple_mascot.png";
import RecipeDetail from "../pages/recipe/RecipeDetail";
import { ClipLoader } from "react-spinners"; // 로딩 스피너

/**
 * 메인 슬라이더 컴포넌트
 * 추천 테마별 배너를 슬라이드 형태로 보여주며, 사용자가 클릭하면 해당 테마에 맞는 레시피 목록으로 이동한다.
 * @returns {JSX.Element} 슬라이더 UI 렌더링
 */
export default function SliderComponent() {
    const navigate = useNavigate();  // 페이지 이동을 위한 훅
    const [currentSlide, setCurrentSlide] = useState(0);  // 현재 슬라이드 상태
    const totalSlides = 2; // 추천 테마 목록을 가져옴
    const { recommendThemes } = useRecommendThemes();

    /**
     * 테마 클릭 시 해당 테마의 키워드를 기반으로 추천 페이지로 이동
     * @param theme 추천 테마 객체
     */
    const handleThemeClick = (theme) => {
        const themeKeyword = theme.foodNames.join(' ');  // 테마의 음식명을 공백으로 연결
        navigate(
            `/recommend/recommendFoodCategory?theme=${themeKeyword}&themeName=${theme.themeName}`
        );
    };

    // 슬라이더 설정값 (자동 재생, 슬라이드 변경 시 상태 업데이트 등)
    var settings = {
        dots: true,
        infinite: true,
        speed: 100,
        pauseOnHover: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false,
        afterChange: (current) => setCurrentSlide(current) // 슬라이드 변경 후 현재 슬라이드 번호를 업데이트
    };

    return (
        <div className="main-slide"> {/* 메인 슬라이드 컨테이너 */}
            <SlickSlider {...settings}> {/* SlickSlider에 설정값을 전달 */}
                {recommendThemes.map((theme) => (
                    <div
                        className="main-slide-item"  // 슬라이드 아이템 클래스
                        key={theme.themeIdx}  // 테마의 고유 ID를 키로 사용
                        onClick={() => handleThemeClick(theme)} // 클릭 시 테마 이동 핸들러 호출
                    >
                        <img
                            className="main-slide-item-img"  // 슬라이드 이미지 클래스
                            src={theme.themeBannerUrl}  // 테마 배너 이미지 URL
                            alt={theme.themeDescription}  // 테마 설명을 alt 텍스트로 설정
                        />
                    </div>
                ))}
            </SlickSlider>
            <div className="slider-counter">
                {currentSlide + 1} / {recommendThemes.length} {/* 현재 슬라이드 위치를 표시 */}
            </div>
        </div>
    );
}

/**
 * 실시간 인기 검색어 컴포넌트
 * 인기 검색어를 슬라이더 형식으로 보여주며, 사용자가 클릭하면 검색 페이지로 이동한다.
 * 확장 버튼을 통해 전체 검색어를 볼 수 있다.
 * @param {function} onKeywordClick - 검색어 클릭 시 호출되는 함수
 * @returns {JSX.Element} 실시간 인기 검색어 UI 렌더링
 */
export const TopSearch = ({ onKeywordClick }) => {
    const [topKeywords, setTopKeywords] = useState([]); // 상위 키워드 상태
    const [isExpanded, setIsExpanded] = useState(false);  // 확장 여부 상태

    useEffect(() => {
        restaurantfetchTopKeywords(setTopKeywords); // 상위 검색어 데이터를 불러옴
    }, []);


    /**
     * 검색어 클릭 핸들러
     * @param {string} keyword - 클릭된 검색어
     */
    const handleKeywordClick = (keyword) => {
        if (onKeywordClick) {
            onKeywordClick(keyword);  // 검색어 클릭 시 부모 컴포넌트로 콜백 호출
        }
    };

    /**
     * 리스트 확장/축소 상태를 토글
     */
    const toggleExpand = () => {
        setIsExpanded(!isExpanded); // 확장 상태 토글
    }

    // 슬라이더 설정값 (세로로 자동 스크롤)
    const settings = {
        dots: false,
        infinite: true,
        speed: 100,
        pauseOnHover: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        row: 1,
        autoplay: true,
        vertical: true,  // 슬라이드가 세로 방향으로 이동
        arrows: false,
    };

    return (
        <div className="real-time-popularity">
            <h6>실시간 인기</h6>
            {/* 축소 상태일 때 */}
            <div style={{ display: isExpanded ? 'none' : 'block' }}>
                <SlickSlider {...settings}> {/* 실시간 인기 키워드 슬라이더 */}
                    {topKeywords.map((keyword, index) => (
                        <span
                            className="keyword"
                            key={index} // 검색어에 고유 키 할당
                            onClick={() => handleKeywordClick(keyword.keyword)}>
                            {index + 1}. {keyword.keyword} {/* 검색어 텍스트 */}
                        </span>
                    ))}
                </SlickSlider>
            </div>

            {/* 확장 상태일 때 */}
            <div
                className="real-time-popularity-entire"
                style={{ display: isExpanded ? 'block' : 'none' }}
            >
                <div className="real-time-popularity-list">
                    {topKeywords.map((keyword, index) => (
                        <span
                            className="keyword"
                            key={index}
                            onClick={() => handleKeywordClick(keyword.keyword)}>
                        {index + 1}. {keyword.keyword} {/* 검색어 텍스트 */}
                    </span>
                    ))}
                </div>
            </div>

            {/* 확장/축소 버튼 */}
            <button aria-label="인기검색어 전체보기" onClick={toggleExpand}>
                {isExpanded ? <Up /> : <Down />} {/* 확장 여부에 따라 버튼 아이콘 변경 */}
            </button>
        </div>
    );
};


export const RecommendedCategories = () => {
    const {recommendThemes, handleThemeClick } = useRecommendThemes();

    const recommendedCategoriesSettings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        draggable: true,
        swipeToSlide: false,
        centerMode: false,
        arrows: false,
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

/**
* 유저 추천 레시피 컴포넌트
* 유저들이 좋아하는 레시피를 슬라이더 형식으로 보여주며, 사용자는 레시피를 클릭해 자세한 내용을 볼 수 있다.
* 좋아요 기능도 구현되어 있으며, 유저가 좋아요를 누를 수 있다.
* 페이지네이션을 이용하여 서버에서 데이터를 순차적으로 받아오고, 일정 간격으로 데이터가 갱신된다.
* @returns {JSX.Element} 유저 추천 레시피 UI 렌더링
*/
export const UserRecommendedRecipes = () => {
    const { formatViewsCount, setError } = useContext(RecipeContext);  // 조회수 포맷팅 함수 및 에러 처리 함수 가져오기
    const [page, setPage] = useState(0); // 현재 페이지 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [recipes, setRecipes] = useState([]); // 불러온 레시피 상태
    const [hasMore, setHasMore] = useState(true); // 추가 데이터를 로드할 수 있는지 여부
    const sliderRef = useRef(null); // 슬라이더 참조

    /**
     * 서버에서 추천 레시피 데이터를 불러오는 함수
     * 페이지네이션을 사용하여 데이터를 요청하며, 첫 페이지는 캐시된 데이터를 우선 사용한다.
     * @param {number} currentPage - 요청할 페이지 번호
     * @param {boolean} refresh - true이면 데이터를 새로 불러오고 캐시를 갱신
     */
    const fetchRecipes = useCallback(async (currentPage, refresh = false) => {
        setLoading(true);  // 로딩 상태 시작
        try {
            let updatedRecipes = [];

            // 첫 페이지 요청 시, 새로고침이 아니라면 캐시된 데이터 사용
            if (currentPage === 0 && !refresh) {
                const cachedRecipes = localStorage.getItem('recommendedRecipes');
                if (cachedRecipes) {
                    setRecipes(JSON.parse(cachedRecipes));  // 캐시된 데이터를 불러옴
                    setLoading(false);
                    return;
                }
            }

            // 서버에 추천 레시피 데이터 요청
            const response = await axios.get('/api/recipes/recommended', {
                params: { page: currentPage, size: 20 }  // 페이지와 레시피 수 지정
            });

            // 서버에서 받아온 데이터가 있을 경우 상태에 추가
            if (response.data.content.length > 0) {
                updatedRecipes = refresh ? response.data.content : [...recipes, ...response.data.content];  // 새로고침 시 덮어쓰기, 아니면 기존 데이터에 추가
                setRecipes(updatedRecipes);

                // 첫 페이지 데이터를 캐시에 저장
                if (currentPage === 0) {
                    localStorage.setItem('recommendedRecipes', JSON.stringify(updatedRecipes));
                }

                // 슬라이더가 존재하고, 새로 추가된 슬라이드를 자연스럽게 이어지도록 설정
                if (!refresh && sliderRef.current) {
                    const nextSlideIndex = recipes.length;  // 새로 추가된 슬라이드의 첫 인덱스
                    setTimeout(() => sliderRef.current.slickGoTo(nextSlideIndex), 0);  // 슬라이드 이동
                }
            } else {
                setHasMore(false);  // 더 이상 불러올 데이터가 없는 경우
            }
        } catch (error) {
            setError('추천 레시피를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);  // 로딩 상태 종료
        }
    }, [recipes, setError]);

    /**
     * 페이지가 변경되면 해당 페이지 데이터를 불러옴
     * 또한 5분 간격으로 첫 페이지 데이터를 새로 갱신하여 캐시를 업데이트한다.
     */
    useEffect(() => {
        fetchRecipes(page, true);  // 페이지 변경 시 데이터 불러오기

        // 5분마다 첫 페이지 데이터를 새로 불러와 캐시를 갱신
        const intervalId = setInterval(() => {
            fetchRecipes(0, true);  // 첫 페이지 갱신
        }, 300000);  // 300,000ms = 5분

        return () => clearInterval(intervalId);  // 컴포넌트 언마운트 시 인터벌 제거
    }, [page]);

    /**
     * 좋아요 클릭 핸들러
     * 특정 레시피에 대해 좋아요를 토글하고, 로컬 캐시를 제거하여 변경사항 반영
     * @param {number} recipeIdx - 좋아요를 클릭한 레시피의 고유 ID
     */
    const handleLikeClick = useCallback(async (recipeIdx) => {
        try {
            // 좋아요 토글 요청
            await axios.post(`/api/recipes/${recipeIdx}/like`);
            localStorage.removeItem('recommendedRecipes');  // 캐시 제거

            // 좋아요 상태 및 좋아요 수 업데이트
            setRecipes((prevRecipes) =>
                prevRecipes.map((recipe) =>
                    recipe.recipeIdx === recipeIdx
                        ? { ...recipe, liked: !recipe.liked, likesCount: recipe.liked ? recipe.likesCount - 1 : recipe.likesCount + 1 }
                        : recipe
                )
            );
        } catch (error) {
            setError('좋아요 처리 중 오류가 발생했습니다.');
        }
    }, [setError]);

    /**
     * 슬라이드 변경 시 호출되는 핸들러
     * 마지막 슬라이드에 도달하면 다음 페이지의 데이터를 불러온다.
     * @param {number} currentSlide - 현재 슬라이드의 인덱스
     */
    const handleSlideChange = (currentSlide) => {
        if (currentSlide === recipes.length - 1 && hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);  // 다음 페이지로 이동
        }
    };

    // 슬라이더 설정
    const RecipeSettings = {
        dots: false,
        infinite: true,  // 슬라이더가 끝에 도달하면 처음으로 돌아감
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: true,
        swipeToSlide: true,
        centerMode: true,
        arrows: false,
        autoplay: true,
        afterChange: handleSlideChange // 슬라이드 변경 후 호출(currentSlide) => setCurrentSlide(currentSlide)
    };

    return (
        <>
            <SlickSlider ref={sliderRef} {...RecipeSettings}>
                {/* 로드된 레시피를 슬라이드로 렌더링 */}
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div key={recipe.recipeIdx} className="recipe-card-item">
                            <div className="user-recommended-recipe-card">
                                <div className="user-recipe-card-user">
                                    <div className="user-recipe-card-user-left">
                                        <div className="recipe-user-profile">
                                            <img src={recipe.profileImage || mascot} alt={recipe.author} />
                                        </div>
                                        <p className="author">{recipe.nickname}</p>
                                    </div>
                                    <div className="recipe-like">
                                        <button className="recipe-like-button" onClick={() => handleLikeClick(recipe.recipeIdx)}>
                                            {recipe.liked ? <Heart /> : <HeartLine />}
                                        </button>
                                        {formatViewsCount(recipe.likesCount)}
                                    </div>
                                </div>
                                <Link className="user-recommended-recipe-link" to={`/recipe/${recipe.recipeIdx}`}>
                                    <div className="user-recommended-recipe-card-image">
                                        <img
                                            src={recipe.picture || '/images/default_recipe_image.jpg'}
                                            alt={recipe.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = mascot;
                                            }}
                                        />
                                        <span className="recipe-view">
                                            <View />
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
            {/* 로딩 중 애니메이션 */}
            {loading && (
                <div className="loading-spinner slider">
                    <ClipLoader size={50} color={"#123abc"} loading={loading} />
                </div>
            )}
        </>
    );
};