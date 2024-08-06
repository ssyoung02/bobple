// // src/components/Recipe/RecipeSearchResults.jsx
// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from '../../utils/axios';
// import RecipeCard from './RecipeCard';
// import '../../assets/style/recipe/RecipeSearchResults.css';
//
// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }
//
// function RecipeSearchResults() {
//     const query = useQuery();
//     const searchKeyword = query.get('keyword') || '';
//     const category = query.get('category') || '';
//     const [recipes, setRecipes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [newSearchKeyword, setNewSearchKeyword] = useState(searchKeyword);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const fetchRecipes = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get('/api/recipes/search', {
//                     params: { keyword: searchKeyword, category, page: 0, size: 10, sort: 'createdAt,desc' }
//                 });
//                 setRecipes(response.data.content);
//             } catch (error) {
//                 setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchRecipes();
//     }, [searchKeyword, category]);
//
//     const handleSearchInputChange = (e) => {
//         setNewSearchKeyword(e.target.value);
//     };
//
//     const handleSearchClick = () => {
//         navigate(`/recipe/search/results?keyword=${newSearchKeyword}&category=${category}`);
//     };
//
//     return (
//         <div className="recipe-search-results-container">
//             <div className="search-area">
//                 <input
//                     type="text"
//                     className="search-input"
//                     placeholder="검색 키워드를 입력해주세요"
//                     value={newSearchKeyword}
//                     onChange={handleSearchInputChange}
//                 />
//                 <button className="search-button" onClick={handleSearchClick}>
//                     검색
//                 </button>
//             </div>
//             {loading ? (
//                 <div className="loading-message">Loading...</div>
//             ) : error ? (
//                 <div className="error-message">{error}</div>
//             ) : (
//                 <div className="recipe-list">
//                     {recipes.length > 0 ? (
//                         recipes.map(recipe => (
//                             <div key={recipe.recipeIdx} className="recipe-list-item">
//                                 <RecipeCard recipe={recipe} />
//                             </div>
//                         ))
//                     ) : (
//                         <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default RecipeSearchResults;

// src/components/Recipe/RecipeSearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import RecipeCard from './RecipeCard';
import SearchFilter from './SearchFilter'; // SearchFilter 추가
import '../../assets/style/recipe/RecipeSearchResults.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function RecipeSearchResults() {
    const query = useQuery();
    const searchKeyword = query.get('keyword') || '';
    const category = query.get('category') || '';
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newSearchKeyword, setNewSearchKeyword] = useState(searchKeyword);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/recipes/search', {
                    params: { keyword: searchKeyword, category, page: currentPage, size: 10, sort: 'likesCount,desc,viewsCount,desc' }
                });
                setRecipes(response.data.content);
                setTotalPages(response.data.totalPages);

            } catch (error) {
                setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [searchKeyword, category, currentPage]);

    const handleSearchInputChange = (e) => {
        setNewSearchKeyword(e.target.value);
    };

    const handleSearchClick = () => {
        console.log("Search button clicked");
        navigate(`/recipe/search?keyword=${newSearchKeyword}&category=${category}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="recipe-search-results-container">
            <SearchFilter/> {/* SearchFilter 추가 */}
            <div className="search-area">
                <input
                    type="text"
                    className="search-input"
                    placeholder="검색 키워드를 입력해주세요"
                    value={newSearchKeyword}
                    onChange={handleSearchInputChange}
                />
                <button className="search-button" onClick={handleSearchClick}>
                    검색
                </button>
            </div>
            {loading ? (
                <div className="loading-message">Loading...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="recipe-list">
                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <div key={recipe.recipeIdx} className="recipe-list-item">
                                <RecipeCard recipe={recipe}/>
                            </div>
                        ))
                    ) : (
                        <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
                    )}
                </div>
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
}

export default RecipeSearchResults;
