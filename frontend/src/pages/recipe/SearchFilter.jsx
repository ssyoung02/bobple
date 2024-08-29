import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from "../../components/layout/PageHeader";
import { Down, SearchIcon, Up } from "../../components/imgcomponents/ImgComponents";
import { useLocation } from 'react-router-dom';

/**
 * SearchFilter 컴포넌트
 * 레시피 목록을 검색하거나 카테고리, 정렬 기준으로 필터링할 수 있는 UI를 제공하는 컴포넌트입니다.
 * 사용자는 검색어를 입력하고 카테고리 및 정렬 기준을 선택한 후 검색 결과를 확인할 수 있습니다.
 */
function SearchFilter() {
    const [keyword, setKeyword] = useState(''); // 검색어 상태
    const [category, setCategory] = useState(''); // 선택된 카테고리 상태
    const [sortBy, setSortBy] = useState('createdAt,desc');   // 선택된 정렬 기준 상태
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
    const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);  // 카테고리 선택 드롭다운 상태
    const [isLatestSelectOpen, setIsLatestSelectOpen] = useState(false);   // 정렬 기준 선택 드롭다운 상태
    const location = useLocation(); // 현재 URL 경로 정보 가져오기

    /**
     * handleSearch 함수
     * 사용자가 검색 버튼을 클릭했을 때 호출되어, 검색어, 카테고리, 정렬 기준을 기반으로 URL을 생성하고 이동합니다.
     */
    const handleSearch = () => {
        // 검색어, 카테고리, 정렬 기준을 쿼리스트링에 포함하여 검색 결과 페이지로 이동
        navigate(`/recipe/search?keyword=${keyword}&category=${category}&sort=${sortBy}`);
    };

    /**
     * useEffect 훅
     * URL의 쿼리스트링에 있는 카테고리 정보를 가져와 컴포넌트 상태에 반영합니다.
     */
    useEffect(() => {
        const params = new URLSearchParams(location.search); // 현재 URL에서 쿼리스트링 파라미터 추출
        const categoryParam = params.get('category'); // 카테고리 파라미터 추출
        if (categoryParam) {
            setCategory(categoryParam); // 카테고리 상태 업데이트
        }
    }, [location]); // location이 변경될 때마다 useEffect 실행

    // 카테고리 선택 옵션 리스트
    const categoryOptions = [
        { key: null, text: '전체', value: '' },
        { key: 'korean', text: '한식', value: '한식' },
        { key: 'chinese', text: '중식', value: '중식' },
        { key: 'japanese', text: '일식', value: '일식' },
        { key: 'yangsik', text: '양식', value: '양식' }
    ];

    // 정렬 기준 선택 옵션 리스트
    const sortOptions = [
        { key: 'latest', text: '최신순', value: 'createdAt,desc' },
        { key: 'popularity', text: '인기순', value: 'likesCount,desc' },
        { key: 'views', text: '조회수순', value: 'viewsCount,desc' }
    ];

    /**
     * handleSelectOpen 함수
     * 카테고리 또는 정렬 기준 드롭다운을 토글하는 함수입니다.
     * @param {string} type - 토글하려는 드롭다운 타입 ('category' 또는 'latest')
     */
    const handleSelectOpen = (type) => {
        if (type === 'category') {
            setIsCategorySelectOpen(!isCategorySelectOpen);  // 카테고리 드롭다운 토글
        } else if (type === 'latest') {
            setIsLatestSelectOpen(!isLatestSelectOpen);  // 정렬 기준 드롭다운 토글
        }
    };

    return (
        <div className="search-filter-container">
            {/* PageHeader 컴포넌트, 카테고리를 제목으로 표시 */}
            <PageHeader title={category} />

            {/* 검색 영역 */}
            <div className="recipe-search-area">
                <input
                    type="text"
                    className="recipe-search-input"
                    placeholder="검색어를 입력하세요"
                    value={keyword} // 검색어 상태와 연결
                    onChange={(e) => setKeyword(e.target.value)}  // 검색어 변경 시 상태 업데이트
                />
                <button className="recipe-search-button" onClick={handleSearch} aria-label="검색">
                    <SearchIcon /> {/* 검색 아이콘 */}
                </button>
            </div>

            {/* 필터 옵션 영역 */}
            <div className="filter-options">
                <div className="select-container">
                    <select
                        className="point-date-select"
                        value={category} // 선택된 카테고리 상태와 연결
                        onChange={(e) => setCategory(e.target.value)} // 카테고리 변경 시 상태 업데이트
                        onClick={() => handleSelectOpen('category')} // 드롭다운 토글
                    >
                        {categoryOptions.map(option => (
                            <option key={option.key} value={option.value}>{option.text}</option>
                        ))}
                    </select>
                    {isCategorySelectOpen ? <Up /> : <Down />} {/* 드롭다운 아이콘 표시 */}
                </div>

                {/* 정렬 기준 선택 */}
                <div className="select-container">
                    <select
                        className="point-date-select"
                        value={sortBy} // 선택된 정렬 기준 상태와 연결
                        onChange={(e) => setSortBy(e.target.value)} // 정렬 기준 변경 시 상태 업데이트
                        onClick={() => handleSelectOpen('latest')}  // 드롭다운 토글
                    >
                        {sortOptions.map(option => (
                            <option key={option.key} value={option.value}>{option.text}</option>
                        ))}
                    </select>
                    {isLatestSelectOpen ? <Up /> : <Down />} {/* 드롭다운 아이콘 표시 */}
                </div>
            </div>
        </div>
    );
}

export default SearchFilter;
