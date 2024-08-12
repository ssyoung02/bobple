import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from "../../components/layout/PageHeader";
import { Down, SearchIcon, Up } from "../../components/imgcomponents/ImgComponents";
import { useLocation } from 'react-router-dom';

function SearchFilter() {
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const navigate = useNavigate();
    const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
    const [isLatestSelectOpen, setIsLatestSelectOpen] = useState(false);
    const location = useLocation();

    const handleSearch = () => {
        navigate(`/recipe/search?keyword=${keyword}&category=${category}&sort=${sortBy}`);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
            setCategory(categoryParam);
        }
    }, [location]);

    const categoryOptions = [
        { key: null, text: '전체', value: '' },
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

    const handleSelectOpen = (type) => {
        if (type === 'category') {
            setIsCategorySelectOpen(!isCategorySelectOpen);
        } else if (type === 'latest') {
            setIsLatestSelectOpen(!isLatestSelectOpen);
        }
    };

    return (
        <div className="search-filter-container">
            <PageHeader title={category} />
            <div className="recipe-search-area">
                <input
                    type="text"
                    className="recipe-search-input"
                    placeholder="검색어를 입력하세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button className="recipe-search-button" onClick={handleSearch} aria-label="검색">
                    <SearchIcon />
                </button>
            </div>

            <div className="filter-options">
                <div className="select-container">
                    <select
                        className="point-date-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        onClick={() => handleSelectOpen('category')}
                    >
                        {categoryOptions.map(option => (
                            <option key={option.key} value={option.value}>{option.text}</option>
                        ))}
                    </select>
                    {isCategorySelectOpen ? <Up /> : <Down />}
                </div>

                <div className="select-container">
                    <select
                        className="point-date-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        onClick={() => handleSelectOpen('latest')}
                    >
                        {sortOptions.map(option => (
                            <option key={option.key} value={option.value}>{option.text}</option>
                        ))}
                    </select>
                    {isLatestSelectOpen ? <Up /> : <Down />}
                </div>
            </div>
        </div>
    );
}

export default SearchFilter;
