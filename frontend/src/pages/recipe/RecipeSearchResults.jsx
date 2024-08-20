// src/components/Recipe/RecipeSearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import RecipeCard from './RecipeCard';
import SearchFilter from './SearchFilter';
import '../../assets/style/recipe/RecipeSearchResults.css';
import {ClipLoader} from "react-spinners";

/**
 * URLSearchParams를 사용해 쿼리 파라미터를 가져오는 헬퍼 함수
 * @returns {URLSearchParams} - 현재 URL의 쿼리 파라미터를 가져옴
 */
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

/**
 * RecipeSearchResults 컴포넌트
 * 사용자가 입력한 키워드와 카테고리로 레시피 검색 결과를 보여주는 컴포넌트
 * 검색 필터와 페이징 기능을 제공하며, 각 레시피를 RecipeCard 컴포넌트로 렌더링
 * @returns {JSX.Element} 레시피 검색 결과 UI 렌더링
 */
function RecipeSearchResults() {
    const query = useQuery(); // URL 쿼리 파라미터를 추출
    const searchKeyword = query.get('keyword') || ''; // 검색 키워드를 쿼리에서 가져옴 (기본값은 빈 문자열)
    const category = query.get('category') || ''; // 선택된 카테고리를 쿼리에서 가져옴 (기본값은 빈 문자열)
    const sort = query.get('sort') || 'likesCount,desc'; // 정렬 조건을 쿼리에서 가져옴 (기본값은 좋아요 순)

    const [recipes, setRecipes] = useState([]);  // 검색 결과 레시피 목록 상태
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [newSearchKeyword, setNewSearchKeyword] = useState(searchKeyword);   // 새로운 검색 키워드 상태
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
    const navigate = useNavigate();  // 페이지 이동을 위한 훅

    /**
     * 검색어, 카테고리, 정렬 조건 또는 페이지가 변경될 때마다 서버에서 레시피 목록을 가져오는 효과
     */
    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);  // 데이터 요청 시작 시 로딩 상태로 전환
            try {
                const response = await axios.get('/api/recipes/search', {
                    params: { keyword: searchKeyword, category, page: currentPage, size: 10, sort } // 검색 조건과 페이지 정보 전달
                });
                setRecipes(response.data.content); // 서버로부터 받은 레시피 데이터를 상태로 저장
                setTotalPages(response.data.totalPages);  // 총 페이지 수를 상태로 저장

            } catch (error) {
                setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.'); // 에러 발생 시 메시지 설정
            } finally {
                setLoading(false); // 데이터 요청 완료 후 로딩 상태 해제
            }
        };

        fetchRecipes(); // 함수 호출로 레시피 데이터를 불러옴
    }, [searchKeyword, category,sort, currentPage]);  // 종속성 배열: 검색어, 카테고리, 정렬 조건, 페이지 변경 시 실행됨

    /**
     * 페이지 번호 클릭 시 페이지 변경 핸들러
     * @param {number} page - 선택한 페이지 번호
     */
    const handlePageChange = (page) => {
        setCurrentPage(page); // 현재 페이지를 선택한 페이지로 업데이트
    };

    return (
        <div className="recipe-search-results-container">
            <SearchFilter/> {/* 검색 필터 컴포넌트 */}
            {loading ? (
                <div className="loading-spinner">
                    <ClipLoader size={50} color={"#123abc"} /> {/* 로딩 중일 때 스피너 표시 */}
                </div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="recipe-list">
                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <div key={recipe.recipeIdx} className="recipe-list-item">
                                <RecipeCard recipe={recipe}/> {/* 각 레시피를 RecipeCard 컴포넌트로 렌더링 */}
                            </div>
                        ))
                    ) : (
                        <div className="no-recipes-message">조회된 레시피가 없습니다.</div>
                    )}
                </div>
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
}

export default RecipeSearchResults;
