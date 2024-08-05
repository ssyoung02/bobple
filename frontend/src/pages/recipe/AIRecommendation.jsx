// src/components/Recipe/AIRecommendation.jsx
import React, { useState, useContext } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import '../../assets/style/recipe/AIRecommendation.css'; // CSS 파일 import

function AIRecommendation() {
    const { recommendRecipes } = useContext(RecipeContext);
    const [ingredients, setIngredients] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleRecommend = async () => {
        // 유효성 검사: 재료 입력 확인
        if (!ingredients.trim()) {
            alert('재료를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null); // 이전 에러 메시지 초기화

        try {
            await recommendRecipes(ingredients);
        } catch (error) {
            setError(error.message || 'AI 추천 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-recommendation-container">
            <h2>AI 레시피 추천</h2>
            <form onSubmit={handleRecommend}>
                <input
                    type="text"
                    placeholder="재료를 쉼표로 구분하여 입력하세요. (예: 닭가슴살, 양파, 마늘)"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={!ingredients.trim() || loading}>
                    {loading ? '추천 중...' : '추천 받기'}
                </button>
            </form>
        </div>
    );
}

export default AIRecommendation;
