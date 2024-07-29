import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import '../../assets/style/allSearch/AllSearch.css';

const AllSearch = () => {
    const [keyword, setKeyword] = useState('');
    const [topKeywords, setTopKeywords] = useState([]);

    const handleSearch = async () => {
        try {
            await axios.post('http://localhost:8080/api/PopularSearch', keyword, {
                headers: {
                    'Content-Type': 'text/plain',
                },
                withCredentials: true,
            });
            alert('검색어가 저장되었습니다.');
            fetchTopKeywords(); // 새로운 검색어 저장 후 인기 검색어를 다시 가져옵니다.
        } catch (error) {
            console.error('오류가 발생했습니다!', error);
        }
    };

    const fetchTopKeywords = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/TopKeywords', {
                withCredentials: true,
            });
            setTopKeywords(response.data);
        } catch (error) {
            console.error('인기 검색어를 가져오는 중 오류가 발생했습니다!', error);
        }
    };

    useEffect(() => {
        fetchTopKeywords();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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
                <button className="AllSearchButton" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>

            <div>
                <h2>인기검색어</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {topKeywords.map((keyword, index) => (
                        <li key={index}>{index + 1}. {keyword.keyword}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AllSearch;
