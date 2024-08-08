import React, { useState, useEffect } from 'react';
import { fetchTopKeywords, handleKeyDown, handleSearchClick } from '../../components/Search/SearchAll';
import { useNavigate } from 'react-router-dom';
import '../../assets/style/allSearch/AllSearch.css';
import { SearchIcon } from "../../components/imgcomponents/ImgComponents";

const AllSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [topKeywords, setTopKeywords] = useState([]);
    const navigate = useNavigate();
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchTopKeywords(setTopKeywords);
    }, []);


    const handleSearchClick = () => {
        if (keyword.trim() !== '') {
            navigate(`/search/SearchKeyword/${encodeURIComponent(keyword)}`); // AllSearchRouter 참고
            setKeyword('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    useEffect(() => {
        if (isSearching) {
            setIsSearching(false);
        }
    }, [isSearching]);

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
