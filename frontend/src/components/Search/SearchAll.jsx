import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchAll = () => {
    const [keyword, setKeyword] = useState('');
    const [topKeywords, setTopKeywords] = useState([]);

    const handleSearch = async () => {
        try {
            await axios.post('http://localhost:8080/Search/SearchAll', JSON.stringify(keyword), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('검색어가 저장되었습니다.');
            fetchTopKeywords(); // 새로운 검색어 저장 후 인기 검색어를 다시 가져옵니다.
        } catch (error) {
            console.error('오류가 발생했습니다!', error);
        }
    };

    const fetchTopKeywords = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Search/TopKeywords');
            setTopKeywords(response.data);
        } catch (error) {
            console.error('인기 검색어를 가져오는 중 오류가 발생했습니다!', error);
        }
    };

    useEffect(() => {
        fetchTopKeywords();
    }, []);

    return (
        <div>
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색 키워드를 입력해주세요"
            />
            <button onClick={handleSearch}>검색</button>

            <div>
                <h2>인기검색어</h2>
                <ul>
                    {topKeywords.map((keyword, index) => (
                        <li key={index}>{index + 1}. {keyword.keyword}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SearchAll;
