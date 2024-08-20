import React, { useState, useEffect } from 'react';
import { fetchTopKeywords, handleSearchClick } from '../../components/Search/SearchAll';
import { useNavigate } from 'react-router-dom';
import '../../assets/style/allSearch/AllSearch.css';
import { SearchIcon } from "../../components/imgcomponents/ImgComponents";

const AllSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [topKeywords, setTopKeywords] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTopKeywords(setTopKeywords);
    }, []);

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    }; //키워드 변경 함수


    const handleSearch = async (searchKeyword) => { // 검색 함수
        const keywordToSearch = searchKeyword || keyword; // 탑 키워드 클릭 시 사용

        const searchQuery = String(keywordToSearch).trim();

        if (searchQuery !== '') {
            await handleSearchClick(searchQuery, setTopKeywords); // 서버에 검색어 저장
            navigate(`/search/SearchKeyword/${encodeURIComponent(searchQuery)}`); // 화면 전환
            setKeyword(''); // 검색 후 입력창 초기화
        }
    };

    const handleTopKeywordClick = (keyword) => {
        handleSearch(keyword); // 탑 키워드 클릭 시 검색 함수 호출
    };

    return (
        <div className="SearchBox">
            <div className="SearchInput">
                <input
                    className="AllSaerchBox"
                    type="text"
                    value={keyword}
                    onChange={handleKeywordChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Enter 키로 검색 실행
                    placeholder="검색 키워드를 입력해주세요"
                />

                <button
                    className="AllSearchButton"
                    onClick={() => handleSearch(keyword)} // 검색 버튼 클릭 시 검색 실행
                >
                    <SearchIcon/>
                </button>
            </div>
            <br/>
            <div className="star-search">
                <h2 className="all-search-title">인기검색어</h2>
                <ul className="search-ul">
                    {topKeywords.map((keyword, index) => (
                        <li
                            key={index}
                            className="search-list"
                            onClick={() => handleTopKeywordClick(keyword.keyword)}
                        >
                            <span>{index + 1}</span>. {keyword.keyword}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AllSearch;
