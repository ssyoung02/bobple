// src/components/Recipe/SearchFilter.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/style/recipe/SearchFilter.css';

function SearchFilter() {
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(`/recipe/search?keyword=${keyword}&category=${category}&sort=${sortBy}`);
    };

    const categoryOptions = [
        { key: null, text: '전체', value: ''  },
        { key: 'korean', text: '한식', value: '한식' },
        { key: 'chinese', text: '중식', value: '중식' },
        { key: 'japanese', text: '일식', value: '일식' },
        { key: 'yangsik', text: '양식', value: '양식' }
    ];

    const sortOptions = [
        { key: 'latest', text: '최신순', value: 'createdAt,desc' },
        { key: 'popularity', text: '인기순', value: 'likesCount,desc' },
        { key: 'views', text: '조회수순', value: 'viewsCount,desc' }
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

                <select className="category-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    {sortOptions.map(option => (
                        <option key={option.key} value={option.value}>{option.text}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default SearchFilter;
