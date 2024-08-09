import React, { useState, useContext } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import '../../assets/style/recipe/AIRecommendation.css';
import { useHeaderColorChange } from "../../hooks/NavigateComponentHooks";
import { useLocation, useNavigate } from 'react-router-dom';
import PageHeader from "../../components/layout/PageHeader";
import {ThinkingAbout} from "../../components/imgcomponents/ImgComponents";

function AIRecommendation() {
    const { recommendRecipes } = useContext(RecipeContext);
    const [ingredients, setIngredients] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    useHeaderColorChange(location.pathname, '#AEE2FF');

    const handleRecommend = async (e) => {
        e.preventDefault();

        if (!ingredients.trim()) {
            alert('재료를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await recommendRecipes(ingredients);
        } catch (error) {
            setError(error.message || 'AI 추천 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const textarea = e.target;
        setIngredients(textarea.value);

        // 입력된 내용에 따라 textarea의 높이를 자동으로 조정
        textarea.style.height = 'auto'; // 먼저 height를 auto로 설정하여 스크롤이 나타나지 않도록 함
        textarea.style.height = textarea.scrollHeight + 'px'; // 내용에 따라 높이를 설정
    };

    return (
        <div className="ai-recommendation-main">
            <PageHeader title="BOBPLE AI"/>
            <div className="ai-recommendation-info">
                <p>
                    키워드 입력을 통해<br/>
                    AI가 레시피를 제공합니다.
                </p>
                <img src="/bobple_mascot.png" alt="밥플이" width={110} height={130}/>
            </div>
            <form onSubmit={handleRecommend} className="ai-recommendation-form">
                <textarea
                    placeholder="재료를 쉼표로 구분하여 입력하세요. (예: 닭가슴살, 양파, 마늘)"
                    value={ingredients}
                    onChange={handleInputChange}
                    rows={3} // 초기 줄 수 설정
                    className="ai-recommendation-textarea"
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={!ingredients.trim() || loading}>
                    {loading ? '추천 중...' : '추천 받기'}
                </button>
            </form>
            <ThinkingAbout/>
        </div>
    );
}

export default AIRecommendation;
