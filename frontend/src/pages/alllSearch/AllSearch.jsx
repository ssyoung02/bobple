import React, { useState, useEffect } from 'react';
import { fetchTopKeywords, handleKeyDown, handleSearchClick } from '../../components/Search/SearchAll';
import '../../assets/style/allSearch/AllSearch.css';
import { SearchIcon } from "../../components/imgcomponents/ImgComponents";

const AllSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [topKeywords, setTopKeywords] = useState([]);

    useEffect(() => {
        fetchTopKeywords(setTopKeywords);
    }, []);

    return (
        <div className="SearchBox">
            <div className="SearchInput">
                <input
                    className="AllSaerchBox"
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown(keyword, setTopKeywords)}
                    placeholder="검색 키워드를 입력해주세요"
                />

                <button className="AllSearchButton" onClick={handleSearchClick(keyword, setTopKeywords)}>
                    <SearchIcon/>
                </button>
            </div>

            <div>
                <h2>인기검색어</h2>
                <ul style={{listStyleType: 'none', padding: 0}}>
                    {topKeywords.map((keyword, index) => (
                        <li key={index}>{index + 1}. {keyword.keyword}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AllSearch;
