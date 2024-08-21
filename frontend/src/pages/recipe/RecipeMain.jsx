import React, {useState, useContext, useEffect, useRef, useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import RecipeContext from '../../pages/recipe/RecipeContext';  // 레시피 관련 상태를 관리하는 컨텍스트
import LatestRecipeCard from './LatestRecipeCard';  // 최신 레시피를 보여주는 카드 컴포넌트
import axios from "../../utils/axios";   // 커스텀 axios 인스턴스
import "../../assets/style/recipe/RecipeMain.css";  // 스타일 파일
import {
    ArrowRightLong,
    MoreIcon,
    NextTo,
    PrevTo,
    SearchIcon,
    TopArrow
} from "../../components/imgcomponents/ImgComponents";
import {UserRecommendedRecipes} from "../../components/SliderComponent"; // 유저 추천 레시피 슬라이더 컴포넌트
import {ClipLoader} from "react-spinners";  // 로딩 스피너 컴포넌트

/**
 * RecipeMain 컴포넌트
 * 레시피 메인 페이지로, 검색, AI 추천 레시피, 유저 추천 레시피, 최신 레시피 등의 기능을 제공
 *
 * 주요 기능:
 * 1. 레시피 검색: 사용자가 입력한 키워드로 레시피를 검색하고 결과를 보여줌
 * 2. AI 추천: 사용자가 선택한 재료로 AI가 레시피를 추천함
 * 3. 최신 레시피 무한 스크롤: 최신 레시피를 로드하며, 마지막 레시피에 도달하면 자동으로 더 많은 레시피를 로드함
 *
 * 무한 스크롤 로직 설명:
 * - 무한 스크롤을 구현하기 위해 IntersectionObserver를 사용합니다.
 * - IntersectionObserver는 마지막 레시피 카드가 뷰포트에 보이게 되면 '교차'가 발생하며, 이를 통해 추가적인 레시피를 로드할 수 있도록 트리거됩니다.
 * - 이 컴포넌트는 'hasMore' 상태를 통해 더 많은 레시피가 남아있는지를 확인하고, 로딩 중이면 새로운 요청을 방지합니다.
 * - 또한 'page' 상태를 사용하여 현재 로드된 페이지 번호를 관리하고, 다음 페이지의 데이터를 비동기적으로 요청하여 'setLatestRecipes' 함수를 통해 레시피 목록을 갱신합니다.
 * - 새로 로드된 레시피는 중복을 방지하기 위해 기존 레시피와 비교하여 중복되지 않은 레시피만 상태에 추가됩니다.
 * - 사용자가 스크롤을 내리면, 마지막 레시피 카드 요소에 'ref'를 부여하고 해당 요소가 화면에 들어오면 다음 페이지의 레시피를 로드하는 방식으로 동작합니다.
 */
function RecipeMain() {
    const {
        getRecipeById, setError, latestRecipes, setLatestRecipes, totalRecipes,
        recipeCategory
    } = useContext(RecipeContext); // RecipeContext에서 필요한 상태와 함수를 가져옴

    // 상태 관리
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색 키워드 상태
    const navigate = useNavigate();   // 페이지 이동을 위한 훅
    const [page, setPage] = useState(() => {
        const storedPage = localStorage.getItem('recipePage');  // 로컬 스토리지에서 저장된 페이지 가져오기
        return storedPage ? JSON.parse(storedPage) : 0;  // 저장된 페이지가 있으면 해당 페이지로 초기화
    });
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [hasMore, setHasMore] = useState(true);  // 더 많은 레시피를 불러올 수 있는지 여부
    const [initialLoad, setInitialLoad] = useState(true);   // 처음 로딩 여부
    const currentRequestPage = useRef(null);  // 현재 요청 중인 페이지를 추적하는 ref
    const observer = useRef();  // 무한 스크롤을 위한 observer
    const [showTopButton, setShowTopButton] = useState(false); // 추가: TOP 버튼 표시 상태
    const userName = localStorage.getItem("name");

    // 초기 로드 시 로컬 스토리지에 저장된 레시피를 불러옴
    useEffect(() => {
        const storedRecipes = localStorage.getItem('latestRecipes');
        if (storedRecipes) {
            setLatestRecipes(JSON.parse(storedRecipes));
            setInitialLoad(false); // 초기 로드 상태 설정
        }
    }, [setLatestRecipes]);

    /**
     * lastRecipeElementRef는 무한 스크롤 기능을 위한 콜백 ref입니다.
     * - 이 함수는 마지막 레시피 카드에 ref를 할당하고, 해당 요소가 뷰포트에 들어오면 더 많은 레시피를 로드하도록 합니다.
     * - IntersectionObserver를 사용하여 마지막 레시피 카드가 화면에 들어오는지를 감지합니다.
     * - 'loading' 또는 'hasMore'가 false일 경우 추가적인 레시피 로드를 방지합니다.
     */
    const lastRecipeElementRef = useCallback(node => {
        if (loading || !hasMore) return; // 로딩 중이거나 더 이상 로드할 레시피가 없으면 return
        if (observer.current) observer.current.disconnect(); // 이전 observer 해제
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {  // 마지막 레시피 카드가 화면에 보이면
                console.log('Last recipe element is intersecting. Loading more recipes...');
                setPage(prevPage => prevPage + 1);  // 페이지 번호 증가하여 다음 페이지 로드
            }
        });
        if (node) observer.current.observe(node); // 새로운 observer 설정
    }, [loading, hasMore]);

    /**
     * loadLatestRecipes 함수는 주어진 페이지 번호로 최신 레시피를 서버에서 불러오는 비동기 함수입니다.
     * - 현재 페이지가 이미 요청된 페이지라면 중복 요청을 방지합니다.
     * - 중복된 레시피는 제거한 후, 새로운 레시피만 상태에 추가하고 로컬 스토리지에도 저장합니다.
     * - 모든 레시피가 로드되었는지를 확인하여 'hasMore' 상태를 업데이트합니다.
     */
    const loadLatestRecipes = useCallback(async (currentPage) => {
        if (!hasMore || currentRequestPage.current === currentPage) return; // 더 이상 불러올 수 없거나 이미 요청 중인 페이지는 무시
        currentRequestPage.current = currentPage; // 현재 페이지를 기록
        setLoading(true);  // 로딩 상태 설정
        console.log(`Requesting page ${currentPage}...`);

        try {
            const response = await axios.get('/api/recipes/latest', {
                params: { page: currentPage, size: 20 }
            });

            if (response.data.content.length > 0) {
                const newRecipes = response.data.content;

                // 중복된 레시피를 제외하고 새로운 레시피만 추가
                const uniqueRecipes = newRecipes.filter(
                    newRecipe => !latestRecipes.some(recipe => recipe.recipeIdx === newRecipe.recipeIdx)
                );

                // 새로운 레시피가 없으면 더 이상 불러올 것이 없다고 판단
                if (uniqueRecipes.length === 0) {
                    console.log('Duplicate recipes found, skipping this load.');
                    setHasMore(false);
                    setLoading(false);
                    return;
                }

                // 새로운 레시피 추가
                setLatestRecipes(prevRecipes => {
                    const updatedRecipes = [...prevRecipes, ...uniqueRecipes];
                    localStorage.setItem('latestRecipes', JSON.stringify(updatedRecipes)); // 로컬 스토리지에 저장
                    return updatedRecipes;
                });

                // 마지막으로 로드된 레시피의 키를 저장
                const lastKey = `${uniqueRecipes[uniqueRecipes.length - 1].recipeIdx}-${uniqueRecipes[uniqueRecipes.length - 1].userIdx}`;
                localStorage.setItem('lastLoadedKey', lastKey);
                console.log("latestRecipes.length + uniqueRecipes.length >= totalRecipes"+ latestRecipes.length+ "+" + uniqueRecipes.length+ " >="+ totalRecipes);

                // 모든 레시피를 불러왔는지 확인
                if (latestRecipes.length + uniqueRecipes.length >= totalRecipes) {
                    console.log('All recipes have been loaded.');
                    setHasMore(false); // 더 이상 불러올 레시피가 없다고 설정
                }
            } else {
                setHasMore(false); // 불러올 레시피가 없으면 hasMore를 false로 설정
            }
        } catch (error) {
            setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);  // 로딩 완료
        }
    }, [hasMore, latestRecipes, totalRecipes, setLatestRecipes, setError]);

    // 컴포넌트 로드 시 또는 페이지 변경 시 최신 레시피를 로드
    useEffect(() => {
        if (totalRecipes === 0 || !totalRecipes) {
            console.log('totalRecipes is not ready yet. Skipping load.');
            return;
        }

        if (initialLoad && latestRecipes.length === 0) {
            console.log('Initial load or page has changed. Loading more recipes...');
            loadLatestRecipes(page); // 첫 페이지의 레시피 로드
            setInitialLoad(false); // 초기 로드 완료
            return;
        }

        if (page > 0) {
            loadLatestRecipes(page); // 추가 페이지의 레시피 로드
        }

        console.log('Current totalRecipes value:', totalRecipes);

    }, [page, initialLoad, loadLatestRecipes, totalRecipes]);

    // 페이지 정보 로컬 스토리지에 저장
    useEffect(() => {
        localStorage.setItem('recipePage', page);
    }, [page]);

    useEffect(() => {
        const topbtn = document.querySelector('.recipe-top-btn');

        const handleScroll = () => {
            if (window.scrollY > 300) { // 예: 300px 이상 스크롤하면 버튼이 나타나게 설정
                topbtn.style.opacity = 1;
            } else {
                topbtn.style.opacity = 0;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // 레시피 카드 클릭 시 상세 정보를 불러오고 페이지 상단으로 이동
    const handleRecipeClick = (recipeId) => {
        getRecipeById(recipeId); // 레시피 상세 정보 가져오기
        window.scrollTo(0, 0); // 스크롤 맨 위로 이동
    };

    // 페이지 상단으로 이동
    const handleTopClick = () => {
        window.scrollTo(0, 0); // 스크롤 맨 위로 이동
    }

    // 검색 키워드 변경 핸들러
    const handleSearchInputChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    // 검색 버튼 클릭 시 검색 결과 페이지로 이동
    const handleSearchClick = () => {
        navigate(`/recipe/search?keyword=${searchKeyword}&category=&sort=viewsCount,desc`);
    };

    // 카테고리 버튼 클릭 시 해당 카테고리의 레시피 검색 결과로 이동
    const handleCategoryClick = (category) => {
        navigate(`/recipe/search?category=${category}&sort=viewsCount,desc`);
    };

    // AI 레시피 추천 페이지로 이동
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
                    placeholder="검색 키워드를 입력해주세요"  // 검색창의 플레이스홀더 텍스트
                    value={searchKeyword}  // 검색 키워드 상태를 연결
                    onChange={handleSearchInputChange}  // 검색 키워드 변경 핸들러 연결
                />
                <button className="recipe-search-button" onClick={handleSearchClick} aria-label="검색">
                    <SearchIcon/> {/* 검색 아이콘 */}
                </button>
            </div>

            {/* AI 레시피 추천 버튼 */}
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
                    {/* 각 레시피 카테고리 버튼을 렌더링 */}
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
                    <h4>{userName} 맞춤 레시피</h4>
                    <Link to="/recipe/search?category=&sort=viewsCount,desc,likesCount,desc" className="more-button">
                        더보기
                        <NextTo/>
                    </Link>
                </div>
                <div className="recipe-slide-banner">
                    <UserRecommendedRecipes/>
                </div>
            </div>

            {/* 최신 레시피 섹션 */}
            {/*최신 레시피 섹션: latestRecipes 배열은 최신 레시피 데이터를 저장하며, 이 데이터를 기반으로 레시피 카드들을 렌더링합니다.*/}
            {/*유일한 키: 각 레시피는 recipeIdx, userIdx, 그리고 인덱스를 결합하여 고유한 키를 생성합니다. 이를 통해 React에서 각 요소의 고유성을 보장합니다.*/}
            {/*마지막 요소에 대한 ref: 최신 레시피 목록 중 마지막 레시피 카드에 lastRecipeElementRef를 연결하여, */}
            {/*                    이 카드가 뷰포트에 들어오면 새로운 페이지의 레시피를 자동으로 불러옵니다. 이를 통해 무한 스크롤을 구현합니다.*/}
            {/*로딩 상태: 레시피가 로드 중일 때는 로딩 스피너가 표시되며, 더 이상 로드할 레시피가 없으면 로딩이 중지됩니다.*/}
            <div className="latest-recipes">
                <h4>최신 레시피</h4>
                <div className="latest-recipe-list">
                    {/* 최신 레시피 목록을 렌더링 */}
                    {latestRecipes.length > 0 ? (
                        latestRecipes.map((recipe, index) => {
                            const uniqueKey = `${recipe.recipeIdx}-${recipe.userIdx}-${index}`;  // 각 레시피에 고유 키 생성
                            // 최신 레시피 목록에서 마지막 요소에 대한 처리
                            if (latestRecipes.length === index + 1) {
                                return (
                                    <div ref={lastRecipeElementRef} key={uniqueKey} // 마지막 레시피에 ref 연결
                                         onClick={() => handleRecipeClick(recipe.recipeIdx)}  // 레시피 클릭 핸들러
                                         className="latest-recipe-card-wrapper">
                                        <LatestRecipeCard recipe={recipe}/>
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={uniqueKey} onClick={() => handleRecipeClick(recipe.recipeIdx)}
                                         className="latest-recipe-card-wrapper">
                                        <LatestRecipeCard recipe={recipe}/>  {/* 개별 레시피 카드 */}
                                    </div>
                                );
                            }
                        })
                    ) : (
                        <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
                    )}
                </div>

                {/* 로딩 스피너 */}
                {loading && (
                    <div className="loading-spinner">
                        <ClipLoader size={50} color={"#123abc"} loading={loading}/>
                    </div>
                )}
            </div>



                <div className={`create-recipe-button-box`}>
                    <button onClick={handleTopClick} className={`recipe-top-btn`} aria-label="맨위로">
                        <TopArrow/>
                    </button>
                    <button className="create-recipe-button" onClick={() => navigate('/recipe/create')}>
                        +
                    </button>
                </div>
        </div>
    );
}

export default RecipeMain;