import axios from "axios";

export const restaurantfetchTopKeywords = async (setTopKeywords) => {
    try {
        const response = await axios.get('http://localhost:8080/api/search/top10', {
            withCredentials: true,
        });
        setTopKeywords(response.data);
    } catch (error) {
        console.error('인기 검색어를 가져오는 중 오류가 발생했습니다!', error);
    }
};
