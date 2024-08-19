import axios from '../../utils/axios';
import React, { useState, useContext } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import '../../assets/style/recipe/AIRecommendation.css';
import { useHeaderColorChange } from "../../hooks/NavigateComponentHooks";
import {useLocation, useNavigate} from 'react-router-dom';
import PageHeader from "../../components/layout/PageHeader";
import {ThinkingAbout} from "../../components/imgcomponents/ImgComponents";
import {ClipLoader} from "react-spinners";

function AIRecommendation() {
    const { recommendRecipes } = useContext(RecipeContext);
    const [ingredients, setIngredients] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const [recipeText, setRecipeText] = useState(''); // 추가: AI 추천 레시피 텍스트

    const navigate = useNavigate();
    useHeaderColorChange(location.pathname, '#AEE2FF');

    const handleRecommend = async (e) => {
        e.preventDefault();

        if (!ingredients.trim()) {
            alert('재료를 입력해주세요.');
            return;
        }

        setLoading(true);
        setError(null);
        setRecipeText(''); // 이전 추천 결과 초기화

        try {
            const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
            const response = await axios.get('http://localhost:8080/api/recipes/recommend-recipes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    ingredients: ingredients
                }
            });

            console.log("AI Response: ", response.data);

            // 문자열 내에 포함된 JSON을 추출
            const aiRecipeData = JSON.parse(response.data.split("data:")[1]);

            // 필요한 필드 추출
            const aiRecipeText = aiRecipeData.result?.message?.content || '추천된 레시피가 없습니다.';
            setRecipeText(aiRecipeText);

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
            {/* 로딩 중일 때 기존 UI를 보여줌 */}
            {!recipeText && !loading && (
                <div className="ai-recommendation-info">
                    <p>
                        키워드 입력을 통해<br/>
                        AI가 레시피를 제공합니다.
                    </p>
                    <img src="/bobple_mascot.png" alt="밥플이" width={110} height={130}/>
                </div>
            )}
            <form onSubmit={handleRecommend} className="ai-recommendation-form">
                <textarea
                    placeholder=" 당신의 상황과 재료에 맞는 메뉴와 레시피를
                    하이퍼클로바 X 가 추천해드립니다.
                    메세지를 입력하세요!"

                    value={ingredients}
                    onChange={handleInputChange}
                    rows={3}
                    className="ai-recommendation-textarea"
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={!ingredients.trim() || loading}>
                    {loading ? '추천 중...' : '추천 받기'}
                </button>
            </form>

            {/* AI 추천 결과가 있을 때만 출력 */}
            {recipeText && !loading && (
                <div className="ai-recipe-result">
                    <textarea
                        value={ "🧠레시피추천 AI : "+ "\n" + recipeText} // AI 추천 결과를 표시
                        readOnly
                        rows={20} // 출력 줄 수
                        placeholder="AI가 추천하는 레시피가 여기에 표시됩니다."
                        className="ai-recommendation-textarea"
                    />
                </div>
            )}

            {/* 로딩 중 애니메이션 */}
            {loading && (
                <div className="loading-spinner">
                    <ClipLoader  size={50} color={"#0404B4"} loading={loading}/>
                </div>
            )}
            <ThinkingAbout/>
        </div>

    );
}

export default AIRecommendation;