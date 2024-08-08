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

                <button className="AllSearchButton" onClick={handleSearchClick(keyword, setTopKeywords)} aria-label="검색">
                    <SearchIcon/>
                </button>
            </div>

            <div className="search-tagList">
                <div className="search-tag">#점메추</div>
                <div className="search-tag">#스트레스</div>
                <div className="search-tag">#비오는날</div>
                <div className="search-tag">#해장</div>
                <div className="search-tag">#야식</div>
            </div>

            <div className="star-search">
                <h2 className="all-search-title">인기검색어</h2>
                <ul className="search-ul">
                    {topKeywords.map((keyword, index) => (
                        <li key={index} className="search-list">
                            <span>{index + 1}</span>. {keyword.keyword}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AllSearch;
