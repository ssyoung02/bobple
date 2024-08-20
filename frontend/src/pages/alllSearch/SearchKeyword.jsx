/*global kakao*/
import React, {useState, useEffect} from 'react';
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

    const handleBookmarkToggle = async (restaurant) => { // restaurant 객체를 매개변수로 받습니다.
        const userIdx = getUserIdx();
        if (userIdx) { // 로그인한 경우에만 북마크 정보 가져오기
            try {
                const isBookmarked = userBookmarks.includes(restaurant.id);
                if (isBookmarked) {
                    const deleteResponse = await axios.delete(`http://localhost:8080/api/bookmarks/restaurants/${restaurant.id}`, {
                        data: {userIdx}
                    });

                    if (deleteResponse.status === 204) { // 삭제 성공 시
                        setUserBookmarks(prevBookmarks => prevBookmarks.filter(id => id !== restaurant.id));
                        // 북마크 개수 업데이트 (필요에 따라)
                        setRestaurants(prevRestaurants => prevRestaurants.map(r => // r로 변수명 변경
                            r.id === restaurant.id ? {...r, bookmarks_count: (r.bookmarks_count || 0) - 1} : r
                        ));
                    } else {
                        console.error('북마크 삭제 실패:', deleteResponse);
                        // 에러 처리 로직 추가 (필요에 따라)
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

                    if (addResponse.status === 200) { // 추가 성공 시
                        setUserBookmarks(prevBookmarks => [...prevBookmarks, restaurant.id]);
                        // 북마크 개수 업데이트 (필요에 따라)
                        setRestaurants(prevRestaurants => prevRestaurants.map(r =>  // r로 변수명 변경
                            r.id === restaurant.id ? {...r, bookmarks_count: (r.bookmarks_count || 0) + 1} : r
                        ));
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
                        const filteredData = data.filter(restaurant => restaurant.category_name.includes("음식점"));
                        setRestaurants(filteredData);
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
            <h5>{keyword} 검색 결과</h5>
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
                                    <p className="restaurant-address">{restaurant.address_name}</p>
                                    <span
                                        className="restaurant-category"><CaretRight/>{restaurant.category_name.replace('음식점 > ', '')}</span>
                                </a>
                            </div>
                            {/* 북마크 버튼 추가 */}
                            <div className="restaurant-right search-keyword">
                                <span
                                    className="restaurant-distance"><LocationDot/>{Math.round(restaurant.distance)}m</span>
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
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="search-result-title">
                <h4>관련 레시피</h4>
                {recipes.length > 0 &&
                    <button className="more-button" onClick={handleRecipeMoreClick}>더보기</button>
                }
            </div>
            {recipes.length > 0 ? (
                <div className="recipe-list">
                    {recipes.map(recipe => (
                        <div key={recipe.recipeIdx} className="recipe-list-item">
                            <RecipeCard recipe={recipe}
                                        onDelete={handleRecipeDelete}
                                        onLike={handleRecipeLike}/>
                        </div>
                    ))}
                </div>
            ) : (
                <p>레시피가 없습니다.</p>
            )}
            {/* 페이지네이션 버튼 */}
            <div className="pagination">
                {/* 첫 페이지로 이동 버튼 */}
                <button
                    onClick={() => handlePageChange(0)} // 첫 페이지로 이동
                    disabled={currentPage === 0} // 첫 페이지에서는 비활성화
                >
                    &laquo; 첫 페이지
                </button>

                {/* 이전 페이지로 이동 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)} // 이전 페이지로 이동
                    disabled={currentPage === 0} // 첫 페이지에서는 비활성화
                >
                    &lsaquo; 이전
                </button>

                {/* 현재 페이지 주변의 다섯 개의 페이지 번호만 표시 */}
                {[...Array(totalPages)].slice(
                    Math.max(0, currentPage - 2),
                    Math.min(totalPages, currentPage + 3)
                ).map((_, i) => {
                    const pageNumber = Math.max(0, currentPage - 2) + i;
                    return (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)} // 페이지 변경 핸들러 호출
                            className={pageNumber === currentPage ? 'active' : ''}  // 현재 페이지는 활성화된 스타일 적용
                        >
                            {pageNumber + 1} {/* 페이지 번호 표시 */}
                        </button>
                    );
                })}

                {/* 다음 페이지로 이동 버튼 */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)} // 다음 페이지로 이동
                    disabled={currentPage === totalPages - 1} // 마지막 페이지에서는 비활성화
                >
                    다음 &rsaquo;
                </button>

                {/* 마지막 페이지로 이동 버튼 */}
                <button
                    onClick={() => handlePageChange(totalPages - 1)} // 마지막 페이지로 이동
                    disabled={currentPage === totalPages - 1} // 마지막 페이지에서는 비활성화
                >
                    마지막 페이지 &raquo;
                </button>
            </div>
        </div>
    );
};

export default SearchKeyword;