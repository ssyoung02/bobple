import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const prefix = 'http://localhost:8080/api';

const useRecommendThemes = () => {
    const [recommendThemes, setRecommendThemes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendThemes = async () => {
            try {
                const response = await axios.get(`${prefix}/recommendThemes`);
                setRecommendThemes(response.data);
            } catch (error) {
                console.error('추천 테마 정보 가져오기 실패:', error);
            }
        };

        fetchRecommendThemes();
    }, []);

    const handleThemeClick = (themeIdx) => {
        const selectedTheme = recommendThemes.find(theme => theme.themeIdx === themeIdx);
        if (selectedTheme) {
            const themeKeyword = selectedTheme.foodNames.join(' ');
            navigate(`/recommend/recommendFoodCategory?theme=${themeKeyword}&themeName=${selectedTheme.themeName}`);
        }
    };

    return { recommendThemes, handleThemeClick };
};

export default useRecommendThemes;
