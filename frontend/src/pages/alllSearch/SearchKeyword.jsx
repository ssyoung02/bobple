/*global kakao*/
import React, {useState, useEffect, useCallback} from 'react';
import '../../assets/style/allSearch/AllSearch.css';
import NaverImageSearch from "../../components/NaverImageSearch";
import {
    Bookmark,
    FillBookmark,
    CaretRight,
    LocationDot,
    SearchIcon
} from "../../components/imgcomponents/ImgComponents";
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {getUserIdx} from "../../utils/auth";
import axios from "axios";
import RecipeCard from "../recipe/RecipeCard";
import MainRecipeCard from "../recipe/MainRecipeCard";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchKeyword = () => {
    const query = useQuery();
    const searchKeyword = query.get('keyword') || '';
    const category = query.get('category') || '';
    const sort = query.get('sort') || 'likesCount,desc';
    const {keyword: initialKeyword} = useParams();  // URL에서 초기 키워드 가져오기
    const [keyword, setKeyword] = useState(initialKeyword); // 검색창 입력 값 관리
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [recipes, setRecipes] = useState([]); // 레시피 상태 추가
    const [userBookmarks, setUserBookmarks] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    // 주변 음식점 정렬 (거리순)
    const sortedRestaurants = restaurants.slice().sort((a, b) => a.distance - b.distance);

    const fetchBookmarkCounts = useCallback(async (restaurantIds) => {
        try {
            const response = await axios.get('http://localhost:8080/api/bookmarks/restaurants/count', {
                params: { restaurantIds: restaurantIds.join(',') }
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
                    setUserBookmarks(response.data.map(bookmark => bookmark.restaurantId));
                } catch (error) {
                    console.error('북마크 정보 가져오기 실패:', error);
                }
            }
        };

        fetchUserBookmarks();
    }, []);

    const handleBookmarkToggle = async (restaurant) => {
        const userIdx = getUserIdx();
        if (userIdx) {
            try {
                const isBookmarked = userBookmarks.includes(restaurant.id);
                if (isBookmarked) {
                    const deleteResponse = await axios.delete(`http://localhost:8080/api/bookmarks/restaurants/${restaurant.id}`, {
                        data: { userIdx }
                    });

                    if (deleteResponse.status === 204) {
                        setUserBookmarks(prevBookmarks => prevBookmarks.filter(id => id !== restaurant.id));
                        // 북마크 개수 업데이트
                        fetchBookmarkCounts(restaurants.map(r => r.id))
                            .then(bookmarkCounts => {
                                setRestaurants(prevRestaurants => prevRestaurants.map(r =>
                                    r.id === restaurant.id ? { ...r, bookmarks_count: bookmarkCounts[r.id] || 0 } : r
                                ));
                            });
                    } else {
                        console.error('북마크 삭제 실패:', deleteResponse);
                    }
                } else {
                    // 북마크 추가 요청
                    const addResponse = await axios.post('http://localhost:8080/api/bookmarks/restaurants', {
                        userIdx,
                        restaurantId: restaurant.id,
                        restaurantName: restaurant.place_name,
                        addressName: restaurant.address_name,
                        phone: restaurant.phone
                    });

                    if (addResponse.status === 200) {
                        setUserBookmarks(prevBookmarks => [...prevBookmarks, restaurant.id]);
                        // 북마크 개수 업데이트
                        fetchBookmarkCounts(restaurants.map(r => r.id))
                            .then(bookmarkCounts => {
                                setRestaurants(prevRestaurants => prevRestaurants.map(r =>
                                    r.id === restaurant.id ? { ...r, bookmarks_count: bookmarkCounts[r.id] || 0 } : r
                                ));
                            });
                    } else {
                        console.error('북마크 추가 실패:', addResponse);
                    }
                }
            } catch (error) {
                console.error('북마크 처리 실패:', error);
            }
        }
    };


    // 음식점과 레시피를 동시에 검색하는 useEffect
    useEffect(() => {
        const ps = new kakao.maps.services.Places();

        const fetchSearchResults = async (latitude, longitude) => {
            try {
                // 음식점 검색
                const searchOptions = {
                    location: new kakao.maps.LatLng(latitude, longitude),
                    radius: 2000,
                };

                ps.keywordSearch(keyword, (data, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        fetchBookmarkCounts(data.map(restaurant => restaurant.id))
                            .then(bookmarkCounts => {
                                // 사용자 북마크 정보와 북마크 개수를 이용하여 isBookmarked, bookmarks_count 필드 추가
                                const updatedData = data.map(restaurant => ({
                                    ...restaurant,
                                    isBookmarked: userBookmarks.includes(restaurant.id),
                                    bookmarks_count: bookmarkCounts[restaurant.id] || 0
                                }));

                                setRestaurants(updatedData);
                            });
                    } else {
                        console.error("음식점 검색 실패:", status);
                    }
                }, searchOptions);

                const token = localStorage.getItem('token');

                // 레시피 검색
                const recipeResponse = await axios.get(`http://localhost:8080/api/recipes/search`, {
                    params: {keyword: keyword, category, page: currentPage, size: 3, sort},
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setRecipes(recipeResponse.data.content);

            } catch (error) {
                console.error("검색 실패:", error);
            }
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    fetchSearchResults(latitude, longitude);
                },
                (err) => {
                    console.error("geolocation을 사용할 수 없어요:", err.message);
                }
            );
        } else {
            console.error("geolocation을 사용할 수 없어요.");
        }
    }, [category, keyword, sort, currentPage]);

    const handleMoreClick = () => {
        navigate(`/recommend/RecommendFoodCategory?keyword=${encodeURIComponent(keyword)}`); // 키워드 전달
    };

    const handleRecipeMoreClick = () => {
        navigate(`/recipe/search`);
    }

    const handleImageLoaded = (imageUrl) => {
        if (imageUrl) {
            // 이미지가 성공적으로 로드된 경우
        } else {
            console.warn("이미지 로드 실패 또는 이미지 없음");
        }
    };

    const handleSearchClick = () => {
        if (keyword.trim() !== '') {
            navigate(`/search/SearchKeyword/${encodeURIComponent(keyword)}`);
            setKeyword('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleRecipeDelete = (deletedRecipeIdx) => {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.recipeIdx !== deletedRecipeIdx));
    };

    const handleRecipeLike = (updatedRecipe) => {
        setRecipes(prevRecipes =>
            prevRecipes.map(recipe =>
                recipe.recipeIdx === updatedRecipe.recipeIdx ? updatedRecipe : recipe
            )
        );
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="SearchBox">
            <div className="SearchInput">
                <input
                    className="AllSaerchBox"
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="검색 키워드를 입력해주세요"
                />

                {/* handleSearchClick 함수 자체를 전달 */}
                <button className="AllSearchButton" onClick={handleSearchClick}>
                    <SearchIcon/>
                </button>
            </div>
            <h4><span style={{ color: "#ff9800" }}>{keyword}</span> 검색 결과</h4>
            <hr/>
            <div className="search-result-title">
                <h4>주변 음식점</h4>
                {/* 더보기 버튼 */}
                {restaurants.length > 3 && (
                    <button className="more-button" onClick={handleMoreClick}>더보기</button>
                )}
            </div>
            <ul className="restaurant-list">
                {sortedRestaurants.slice(0, 3).map((restaurant) => (
                    <li key={restaurant.id} className="restaurant-item">
                        <a href={restaurant.place_url} target="_blank" rel="noreferrer">
                            <div className="restaurant-image-wrapper">
                                <NaverImageSearch
                                    restaurantName={restaurant.place_name}
                                    onImageLoaded={handleImageLoaded}
                                />
                            </div>
                        </a>
                        <div className="restaurant-info">
                            <div className="restaurant-left">
                                <a href={restaurant.place_url} target="_blank" rel="noreferrer">
                                    <h6 className="restaurant-name">{restaurant.place_name}</h6>
                                    <span
                                        className="restaurant-category"><CaretRight/>{restaurant.category_name.replace('음식점 > ', '')}</span>
                                    <p className="restaurant-address">{restaurant.address_name}</p>
                                </a>
                            </div>
                            {/* 북마크 버튼 추가 */}
                            <div className="restaurant-right search-keyword">
                                <button
                                    className="restaurant-bookmarks search-keyword"
                                    onClick={() => handleBookmarkToggle(restaurant)}
                                >
                                    {userBookmarks.includes(restaurant.id) ? (
                                        <FillBookmark/>
                                    ) : (
                                        <Bookmark/>
                                    )}
                                    {restaurant.bookmarks_count || 0}
                                </button>
                                <span
                                    className="restaurant-distance"><LocationDot/>{Math.round(restaurant.distance)}m</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <hr/>
            <div className="search-result-title">
                <h4>관련 레시피</h4>
                {recipes.length > 0 &&
                    <button className="more-button" onClick={handleRecipeMoreClick}>더보기</button>
                }
            </div>
            {
                recipes.length > 0 ? (
                    <ul className="restaurant-list">
                        {recipes.map(recipe => (
                            <li key={recipe.recipeIdx} className="restaurant-item">
                                <MainRecipeCard recipe={recipe}
                                            onDelete={handleRecipeDelete}
                                            onLike={handleRecipeLike}/>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>레시피가 없습니다.</p>
                )}
            <div className="pagination">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={i === currentPage ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

        </div>
    );
};

export default SearchKeyword;