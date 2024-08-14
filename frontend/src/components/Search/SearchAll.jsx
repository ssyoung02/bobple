import axios from 'axios';

export const handleSearch = async (keyword, fetchTopKeywords) => {
    try {
        await axios.post('http://localhost:8080/api/PopularSearch', keyword, {
            headers: {
                'Content-Type': 'text/plain',
            },
            withCredentials: true,
        });
        //alert('검색어가 저장되었습니다.');
        fetchTopKeywords(); // 업데이트된 인기 검색어 가져오기
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

// keyword와 setTopKeywords를 사용하는 이벤트 핸들러
export const handleKeyDown = (keyword, setTopKeywords) => async (e) => {
    if (e.key === 'Enter' && keyword.trim() !== '') {
        await handleSearch(keyword, () => fetchTopKeywords(setTopKeywords));
    }
};

export const handleSearchClick = async (keyword, setTopKeywords) => {
    if (keyword.trim() !== '') {
        await handleSearch(keyword, () => fetchTopKeywords(setTopKeywords));
    }
};
