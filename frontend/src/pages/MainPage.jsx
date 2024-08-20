/*global kakao*/
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import '../assets/style/MainPage.css'
import SliderComponent from "../components/SliderComponent";
import { clearRecipeLocalStorage } from '../utils/localStorageUtils';
import {
    AiLunch, Bookmark,
    CalculatorBanner, CaretRight, FillBookmark,
    LocationDot,
    Meeting,
    NextTo,
    RandomMenu
} from "../components/imgcomponents/ImgComponents";
import axios from "axios";

import NaverImageSearch from "../components/NaverImageSearch";
import {getUserIdx} from "../utils/auth";
import RecipeCard from "./recipe/RecipeCard";
import RecipeContext from "./recipe/RecipeContext";
import MainRecipeCard from "./recipe/MainRecipeCard";

function MainPage({theme}) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);ㅋㅋ

    useEffect(() => {
        const userData = {
            username: localStorage.getItem("username"),
            email: localStorage.getItem("email"),
            name: localStorage.getItem("name"),
            profileImage: localStorage.getItem("profileImage"),
            provider: localStorage.getItem("provider"),
            companyId: localStorage.getItem("companyId"),
            reportCount: localStorage.getItem("reportCount"),
            point: localStorage.getItem("point"),
            token: localStorage.getItem("token")
        };

        if (userData.token) {
            setUser(userData);
        }
    }, []);


    const moveCalculator = () => {
        clearRecipeLocalStorage();
        navigate('/myPage/calculator');
    };

    const moveRecipeAI = () => {
        clearRecipeLocalStorage();
        navigate('/recipe/ai-recommendation'); // 경로 복원
    }
    const moveGroup = () => {
        clearRecipeLocalStorage();
        navigate('/group');
    };

    const moveRecommend = () => {
        clearRecipeLocalStorage();
        navigate('/recommend/');
    };

    const moveAround = () => {
        navigate('/around');
    };

    const moveRecipe = () => {
        navigate('/recipe');
    };



    //주변 맛집
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [nearbyPub, setNearbyPub] = useState([]);
    const [allNearbyPub, setAllNearbyPub] = useState([]);
    const [recommendedFood, setRecommendedFood] = useState(null);
    const [userBookmarks, setUserBookmarks] = useState([]);
    const lastPubElementRef = useRef(null);  // 마지막 요소에 대한 ref 생성

    // nearbyPub 상태를 거리순으로 정렬
    const sortedNearbyPub = [...nearbyPub].sort((a, b) => a.distance - b.distance);

    // 각 술집의 북마크 개수를 가져오는 요청
    const fetchBookmarkCounts = useCallback(async (pubIds) => {
        try {
            const response = await axios.get('http://localhost:8080/api/bookmarks/restaurants/count', {
                params: { restaurantIds: pubIds.join(',') }
            });
            return response.data;
        } catch (error) {
            console.error('북마크 개수 가져오기 실패:', error);
            return {};
        }
    }, []);

    useEffect(() => {
        const fetchUserBookmarks = async () => {
            const userIdx = getUserIdx();
            if (userIdx) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/bookmarks/restaurants/${userIdx}`);

                    // response.data가 undefined 또는 null인 경우 빈 배열로 설정
                    const bookmarksData = response.data || [];
                    setUserBookmarks(bookmarksData.map(bookmark => bookmark.restaurantId));
                } catch (error) {
                    console.error('북마크 정보 가져오기 실패:', error);
                    // 추가적인 에러 처리 로직 (예: 사용자에게 에러 메시지 표시)
                }
            }
        };

        fetchUserBookmarks();
    }, []);


    const handleBookmarkToggle = async (pub) => { // pub 객체를 매개변수로 받습니다.
        const userIdx = getUserIdx();
        if (userIdx) { // 로그인한 경우에만 북마크 정보 가져오기
            try {
                const isBookmarked = userBookmarks.includes(pub.id);
                if (isBookmarked) {
                    const deleteResponse = await axios.delete(`http://localhost:8080/api/bookmarks/restaurants/${pub.id}`, {
                        data: { userIdx }
                    });

                    if (deleteResponse.status === 204) { // 삭제 성공 시
                        setUserBookmarks(prevBookmarks => prevBookmarks.filter(id => id !== pub.id));
                        // 북마크 개수 업데이트
                        fetchBookmarkCounts(nearbyPub.map(pub => pub.id))
                            .then(bookmarkCounts => {
                                setNearbyPub(prevPubs => prevPubs.map(p => // p로 변수명 변경
                                    p.id === pub.id ? { ...p, bookmarks_count: bookmarkCounts[p.id] || 0 } : p
                                ));
                            });
                    } else {
                        console.error('북마크 삭제 실패:', deleteResponse);
                        // 에러 처리 로직 추가 (필요에 따라)
                    }
                } else {
                    // 북마크 추가 요청
                    const addResponse = await axios.post('http://localhost:8080/api/bookmarks/restaurants', {
                        userIdx,
                        restaurantId: pub.id,
                        restaurantName: pub.place_name,
                        addressName: pub.address_name,
                        phone: pub.phone
                    });

                    if (addResponse.status === 200) { // 추가 성공 시
                        setUserBookmarks(prevBookmarks => [...prevBookmarks, pub.id]);
                        // 북마크 개수 업데이트
                        fetchBookmarkCounts(nearbyPub.map(pub => pub.id))
                            .then(bookmarkCounts => {
                                setNearbyPub(prevPubs => prevPubs.map(p => // p로 변수명 변경
                                    p.id === pub.id ? { ...p, bookmarks_count: bookmarkCounts[p.id] || 0 } : p
                                ));
                            });
                    } else {
                        console.error('북마크 추가 실패:', addResponse);
                        // 에러 처리 로직 추가 (필요에 따라)
                    }
                }
            } catch (error) {
                console.error('북마크 처리 실패:', error);
            }
        }
    };


    useEffect(() => {
        const ps = new kakao.maps.services.Places();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const
                        { latitude, longitude } = position.coords;
                    searchPubsByCategory(latitude, longitude, selectedCategory);
                },
                (err) => {
                    console.error("geolocation을 사용할 수 없어요:", err.message);
                }
            );
        } else {
            console.error("geolocation을 사용할 수 없어요.");
        }

        function searchPubsByCategory(latitude, longitude) {
            const searchOptions = {
                location: new kakao.maps.LatLng(latitude, longitude),
                radius: 2000,
                size: 15, // Load more pubs initially
            };

            const searchKeyword = '음식점';

            ps.keywordSearch(searchKeyword, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    // 각 음식점의 북마크 개수를 가져오는 요청
                    fetchBookmarkCounts(data.map(restaurant => restaurant.id)) // 음식점 ID 배열 전달
                        .then(bookmarkCounts => {
                            // 사용자 북마크 정보와 북마크 개수를 이용하여 isBookmarked, bookmarks_count 필드 추가
                            const updatedData = data.map(restaurant => ({
                                ...restaurant,
                                isBookmarked: userBookmarks.includes(restaurant.id),
                                bookmarks_count: bookmarkCounts[restaurant.id] || 0 // 북마크 개수 설정
                            }));

                            setAllNearbyPub(updatedData);
                            setNearbyPub(updatedData.slice(0, 15));
                        });
                } else {
                    console.error("음식점 검색 실패:", status);
                }
            }, searchOptions);
        }
    }, [userBookmarks]);

    useEffect(() => {
        // 서버에서 추천 음식 정보 가져오기
        axios.get('http://localhost:8080/api/recommendFood')
            .then(response => {
                setRecommendedFood(response.data); // axios는 자동으로 JSON 변환
            })
            .catch(error => {
                console.error('추천 음식 정보 가져오기 실패:', error);
            });
    }, []);


    const handleImageLoaded = (imageUrl) => {
        // 이미지 로드 완료 시 호출되는 콜백 함수
        if (imageUrl) {
            // 이미지가 성공적으로 로드된 경우
        } else {
            // 이미지를 찾지 못했거나 에러 발생 시
            console.warn("이미지 로드 실패 또는 이미지 없음");
            // 필요에 따라 기본 이미지 설정 또는 에러 처리
        }
    };

    // nearbyPub에서 처음 3개의 객체만 가져옴
    const firstThreePubs = sortedNearbyPub.slice(0, 3);


    //좋아요 순 레시피
    const {
        getRecipeById, setError, latestRecipes, setLatestRecipes, totalRecipes,
        recipeCategory
    } = useContext(RecipeContext);

    const searchKeyword = '';
    const category = '';
    const sort = 'likesCount,desc';
    const size = 3;

    const [recipes, setRecipes] = useState([]); // 데이터를 저장할 상태
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);


    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/recipes/search', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    params: {
                        keyword: searchKeyword,
                        category,
                        page: 0,
                        size,
                        sort
                    }
                });

                // 받아온 데이터를 상태에 저장
                setRecipes(response.data.content);

            } catch (error) {
                setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [searchKeyword, category, sort, size]);


    return (
        <div className="mainPage">
            <SliderComponent/>
            <div className="sliderbox"></div>
            <div className="shortMenu">
                <button className="shortMenuItem" onClick={moveCalculator}>
                    <div className="shortMenuIcon">
                        <CalculatorBanner theme={theme}/> {/* theme 전달 */}
                    </div>
                    <p className="shortMenuName">1/N</p>
                </button>
                <button className="shortMenuItem" onClick={moveRecipeAI}>
                    <div className="shortMenuIcon">
                        <AiLunch theme={theme}/> {/* theme 전달 */}
                    </div>
                    <p className="shortMenuName">AI 도시락</p>
                </button>
                <button className="shortMenuItem" onClick={moveGroup}>
                    <div className="shortMenuIcon">
                        <Meeting theme={theme}/> {/* theme 전달 */}
                    </div>
                    <p className="shortMenuName">번개모임</p>
                </button>
                <button className="shortMenuItem" onClick={moveRecommend}>
                    <div className="shortMenuIcon">
                        <RandomMenu theme={theme}/> {/* theme 전달 */}
                    </div>
                    <p className="shortMenuName">랜덤메뉴</p>
                </button>
            </div>
            <div className="summation-box">
                <div className="summation-top">
                    <div className="summation-left">
                        <span className="summation-title">
                            가까운 매장
                        </span>
                        <h3>
                            {user && (<>{user.name}님</>)} 근처 맛집
                        </h3>
                    </div>
                    <button className="summation-more" onClick={moveAround}>
                        더보기 <NextTo/>
                    </button>
                </div>
                <div className="summation-content">
                    {firstThreePubs.length > 0 ? (
                        <ul className="restaurant-info-list">
                            {firstThreePubs.map((pub, index) => (
                                <li
                                    key={pub.id}
                                    className="restaurant-info-item"
                                    ref={index === firstThreePubs.length - 1 ? lastPubElementRef : null} // 마지막 요소에 ref 할당
                                >
                                    <div className="restaurant-image-wrapper">
                                        {/* NaverImageSearch 컴포넌트 사용 */}
                                        <NaverImageSearch
                                            restaurantName={pub.place_name}
                                            onImageLoaded={handleImageLoaded}
                                        />

                                    </div>
                                    <div className="pub-info-container"
                                         onClick={() => navigate(`/recommend/restaurant/${pub.id}`, {state: {restaurant: pub}})}
                                         style={{cursor: 'pointer'}}
                                    >
                                        <div>
                                            <h6 className="pub-name">{pub.place_name}</h6>
                                        </div>
                                        <span
                                            className="restaurant-category"><CaretRight/> {pub.category_name.replace('음식점 > ', '')}</span>

                                        <p className="pub-address">{pub.address_name}</p>
                                    </div>
                                    <div className="pub-bookmark-state">
                                        <button
                                            className="pub-bookmarks"
                                            onClick={() => handleBookmarkToggle(pub)} // 클릭 이벤트 추가
                                        >
                                            {userBookmarks.includes(pub.id) ? ( // 사용자 북마크에 포함된 경우
                                                <FillBookmark/>
                                            ) : (
                                                <Bookmark/>
                                            )}
                                            {pub.bookmarks_count || 0}
                                        </button>
                                        <span className="pub-distance"><LocationDot/> {Math.round(pub.distance)}m</span>
                                    </div>

                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>주변 맛집이 없습니다.</p>
                    )}

                </div>
            </div>
            <div className="summation-box">
                <div className="summation-top">
                    <div className="summation-left">
                        <span className="summation-title">
                            BEST 레시피
                        </span>
                        <h3>
                            오늘의 도시락
                        </h3>
                    </div>
                    <button className="summation-more" onClick={moveRecipe}>
                        더보기 <NextTo/>
                    </button>
                </div>
                <div className="summation-content">

                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <div key={recipe.recipeIdx} className="recipe-list-item">
                                <MainRecipeCard recipe={recipe}/>
                            </div>
                        ))
                    ) : (
                        <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
                    )}

                </div>
            </div>

        </div>
    );
}

export default MainPage;
