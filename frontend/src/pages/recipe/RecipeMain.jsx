import React, {useState, useContext, useEffect, useRef, useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import RecipeContext from '../../pages/recipe/RecipeContext';
import LatestRecipeCard from './LatestRecipeCard';
import axios from "../../utils/axios";
import "../../assets/style/recipe/RecipeMain.css";
import {ArrowRightLong, MoreIcon, NextTo, PrevTo, SearchIcon} from "../../components/imgcomponents/ImgComponents";
import {UserRecommendedRecipes} from "../../components/SliderComponent";
import {ClipLoader} from "react-spinners";


function RecipeMain() {
    const {
        getRecipeById, setError, latestRecipes, setLatestRecipes, totalRecipes,
        recipeCategory
    } = useContext(RecipeContext);

    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();
    const [page, setPage] = useState(() => {
        const storedPage = localStorage.getItem('recipePage');
        return storedPage ? JSON.parse(storedPage) : 0;
    });
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const currentRequestPage = useRef(null);

    const observer = useRef();

    useEffect(() => {
        const storedRecipes = localStorage.getItem('latestRecipes');
        if (storedRecipes) {
            setLatestRecipes(JSON.parse(storedRecipes));
            setInitialLoad(false);
        }
    }, [setLatestRecipes]);

    const lastRecipeElementRef = useCallback(node => {
        if (loading || !hasMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                console.log('Last recipe element is intersecting. Loading more recipes...');
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const loadLatestRecipes = useCallback(async (currentPage) => {
        if (!hasMore || currentRequestPage.current === currentPage) return;
        currentRequestPage.current = currentPage;
        setLoading(true);
        console.log(`Requesting page ${currentPage}...`);

        try {
            const response = await axios.get('/api/recipes/latest', {
                params: { page: currentPage, size: 20 }
            });

            if (response.data.content.length > 0) {
                const newRecipes = response.data.content;

                const uniqueRecipes = newRecipes.filter(
                    newRecipe => !latestRecipes.some(recipe => recipe.recipeIdx === newRecipe.recipeIdx)
                );

                if (uniqueRecipes.length === 0) {
                    console.log('Duplicate recipes found, skipping this load.');
                    setHasMore(false);
                    setLoading(false);
                    return;
                }

                setLatestRecipes(prevRecipes => {
                    const updatedRecipes = [...prevRecipes, ...uniqueRecipes];
                    localStorage.setItem('latestRecipes', JSON.stringify(updatedRecipes));
                    return updatedRecipes;
                });

                const lastKey = `${uniqueRecipes[uniqueRecipes.length - 1].recipeIdx}-${uniqueRecipes[uniqueRecipes.length - 1].userIdx}`;
                localStorage.setItem('lastLoadedKey', lastKey);

                if (latestRecipes.length + uniqueRecipes.length >= totalRecipes) {
                    console.log('All recipes have been loaded.');
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }, [hasMore, latestRecipes, totalRecipes, setLatestRecipes, setError]);

    useEffect(() => {
        if (totalRecipes === 0 || !totalRecipes) {
            console.log('totalRecipes is not ready yet. Skipping load.');
            return;
        }

        if (initialLoad && latestRecipes.length === 0) {
            console.log('Initial load or page has changed. Loading more recipes...');
            loadLatestRecipes(page);
            setInitialLoad(false);
            return;
        }

        if (page > 0) {
            loadLatestRecipes(page);
        }

        console.log('Current totalRecipes value:', totalRecipes);

    }, [page, initialLoad, loadLatestRecipes, totalRecipes]);

    useEffect(() => {
        localStorage.setItem('recipePage', page);
    }, [page]);

    const categoryButtons = [
        {name: '한식', image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-korean-food.jpg', category: '한식'},
        {
            name: '양식',
            image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-japanese-food.jpg',
            category: '양식'
        },
        {
            name: '일식',
            image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-western-food.jpg',
            category: '일식'
        },
        {
            name: '중식',
            image: 'https://kr.object.ncloudstorage.com/bobple/banner/recipe-chinese-food.jpg',
            category: '중식'
        },
    ];


    const handleRecipeClick = (recipeId) => {
        getRecipeById(recipeId); // 레시피 상세 정보 가져오기
        window.scrollTo(0, 0); // 스크롤 맨 위로 이동
    };

    const handleTopClick = () => {
        window.scrollTo(0, 0); // 스크롤 맨 위로 이동
    }

    const handleSearchInputChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const handleSearchClick = () => {
        navigate(`/recipe/search?keyword=${searchKeyword}&category=&sort=viewsCount,desc`);
    };

    const handleCategoryClick = (category) => {
        navigate(`/recipe/search?category=${category}&sort=viewsCount,desc`);
    };

    const moveAIRecommendation = () => {
        navigate('/recipe/ai-recommendation');
    }

    return (
        <div className="recipe-main-container">
            {/* 검색 영역 */}
            <div className="recipe-search-area">
                <input
                    type="text"
                    className="recipe-search-input"
                    placeholder="검색 키워드를 입력해주세요"
                    value={searchKeyword}
                    onChange={handleSearchInputChange}
                />
                <button className="recipe-search-button" onClick={handleSearchClick} aria-label="검색">
                    <SearchIcon/>
                </button>
            </div>

            <button className="AIRecipe" onClick={moveAIRecommendation}>
                <div className="AIRecipeTitle">
                    <p>지금 냉장고에 있는 재료로 뭐 만들어 먹지?</p>
                    <h3>AI 레시피 추천</h3>
                </div>
                <ArrowRightLong/>
            </button>

            {/* 도시락 레시피 추천 섹션 */}
            <div className="lunchbox-recipes">
                <h4>도시락 레시피 추천</h4>
                <div className="category-buttons">
                    {recipeCategory.map(button => (
                        <button key={button.name} onClick={() => handleCategoryClick(button.category)}
                                className="category-button">
                            <img src={button.image} alt={button.name}/>
                            <span>#{button.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 유저 추천 레시피 섹션 */}
            <div className="user-recommended-recipes">
                <div className="user-recommended-recipes-title">
                    <h4>유저 추천 레시피</h4>
                    <Link to="/recipe/search?category=&sort=viewsCount,desc,likesCount,desc" className="more-button">
                        더보기
                        <NextTo/>
                    </Link>
                </div>
                <div className="recipe-slide-banner">
                    <UserRecommendedRecipes/>
                </div>
            </div>
            <div className="latest-recipes">
                <h4>최신 레시피</h4>
                <div className="latest-recipe-list">
                    {latestRecipes.length > 0 ? (
                        latestRecipes.map((recipe, index) => {
                            const uniqueKey = `${recipe.recipeIdx}-${recipe.userIdx}-${index}`;
                            if (latestRecipes.length === index + 1) {
                                return (
                                    <div ref={lastRecipeElementRef} key={uniqueKey}
                                         onClick={() => handleRecipeClick(recipe.recipeIdx)}
                                         className="latest-recipe-card-wrapper">
                                        <LatestRecipeCard recipe={recipe}/>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={uniqueKey} onClick={() => handleRecipeClick(recipe.recipeIdx)}
                                         className="latest-recipe-card-wrapper">
                                        <LatestRecipeCard recipe={recipe}/>
                                    </div>
                                );
                            }
                        })
                    ) : (
                        <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
                    )}
                </div>

                {loading && (
                    <div className="loading-spinner">
                        <ClipLoader size={50} color={"#123abc"} loading={loading}/>
                    </div>
                )}
            </div>


            <div className="create-recipe-button-box">
                <button onClick={handleTopClick} className="recipe-top-btn">🔝</button>
                <button className="create-recipe-button" onClick={() => navigate('/recipe/create')}>
                    +
                </button>
            </div>
        </div>
    );
}

export default RecipeMain;