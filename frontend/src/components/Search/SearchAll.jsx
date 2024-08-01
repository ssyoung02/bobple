import axios from 'axios';

export const handleSearch = async (keyword, fetchTopKeywords) => {
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

export const fetchTopKeywords = async (setTopKeywords) => {
    try {
        const response = await axios.get('http://localhost:8080/api/TopKeywords', {
            withCredentials: true,
        });
        setTopKeywords(response.data);
    } catch (error) {
        console.error('인기 검색어를 가져오는 중 오류가 발생했습니다!', error);
    }
};

export const handleKeyDown = (keyword, setTopKeywords) => async (e) => {
    if (e.key === 'Enter') {
        await handleSearch(keyword, () => fetchTopKeywords(setTopKeywords));
    }
};

export const handleSearchClick = (keyword, setTopKeywords) => async () => {
    await handleSearch(keyword, () => fetchTopKeywords(setTopKeywords));
};