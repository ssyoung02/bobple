// src/components/Recipe/SearchFilter.jsx
import React, { useState, useContext } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import '../recipe/css/SearchFilter.css'; // CSS 파일 import

function SearchFilter() {
    const { searchRecipes, page, size } = useContext(RecipeContext);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('latest');

    const handleSearch = () => {
        searchRecipes(keyword, category, page, size, sortBy);
    };

    const categoryOptions = [ // 카테고리 옵션 (예시)
        { key: '', text: '전체', value: '' },
        { key: 'korean', text: '한식', value: 'korean' },
        { key: 'chinese', text: '중식', value: 'chinese' },
        { key: 'japanese', text: '일식', value: 'japanese' },
        // ... 필요한 카테고리 추가
    ];

    const sortOptions = [
        { key: 'latest', text: '최신순', value: 'latest' },
        { key: 'popularity', text: '인기순', value: 'popularity' },
        // ... 필요한 정렬 옵션 추가
    ];

    return (
        <div className="search-filter-container">
            <div className="search-input-wrapper">
                <input
                    type="text"
                    className="search-input"
                    placeholder="검색어를 입력하세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button className="search-button" onClick={handleSearch}>검색</button>
            </div>

            <div className="filter-options">
                <select className="category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categoryOptions.map(option => (
                        <option key={option.key} value={option.value}>{option.text}</option>
                    ))}
                </select>

                <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {sortOptions.map(option => (
                        <option key={option.key} value={option.value}>{option.text}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default SearchFilter;
