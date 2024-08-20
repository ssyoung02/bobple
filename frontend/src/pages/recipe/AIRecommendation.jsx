import axios from '../../utils/axios';
import React, { useState } from 'react';
import '../../assets/style/recipe/AIRecommendation.css';
import { useHeaderColorChange } from "../../hooks/NavigateComponentHooks";
import {useLocation } from 'react-router-dom';
import PageHeader from "../../components/layout/PageHeader";
import {ThinkingAbout} from "../../components/imgcomponents/ImgComponents";
import {ClipLoader} from "react-spinners";

/**
 * AIRecommendation 컴포넌트
 * 사용자가 입력한 재료나 상황에 따라 AI가 레시피를 추천해주는 컴포넌트입니다.
 * - 사용자는 재료나 상황을 입력하고, AI가 해당 재료, 상황을 기반으로 추천하는 레시피를 확인할 수 있습니다.
 * - HyperClova X AI가 추천하는 레시피를 출력합니다.
 */
function AIRecommendation() {
    const [ingredients, setIngredients] = useState(''); // 사용자가 입력한 재료 또는 키워드 상태
    const [loading, setLoading] = useState(false);  // AI 요청 중 로딩 상태 관리
    const [error, setError] = useState(null);  // 에러 상태 관리
    const location = useLocation(); // 현재 URL 경로 정보를 가져오는 hook
    const [recipeText, setRecipeText] = useState(''); // AI로부터 추천된 레시피 텍스트 상태

    // 페이지가 로드될 때 헤더의 색상을 변경하는 커스텀 훅 사용
    useHeaderColorChange(location.pathname, '#AEE2FF');

    /**
     * handleRecommend 함수
     * 사용자가 재료 또는 상황을 입력한 후 추천받기 버튼을 클릭하면 호출되며,
     * 서버로 요청을 보내고 AI로부터 추천받은 레시피를 화면에 표시합니다.
     */
    const handleRecommend = async (e) => {
        e.preventDefault();

        if (!ingredients.trim()) {
            alert('재료를 입력해주세요.');
            return;
        }

        // 재료 입력이 비어있는 경우 처리
        setLoading(true);  // 로딩 상태 활성화
        setError(null); // 이전 오류 상태 초기화
        setRecipeText(''); // 이전 AI 추천 결과 초기화

        try {
            const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
            const response = await axios.get('http://localhost:8080/api/recipes/recommend-recipes', {
                headers: {
                    'Authorization': `Bearer ${token}` // 인증 토큰을 요청 헤더에 포함
                },
                params: {
                    ingredients: ingredients  // 사용자 입력한 재료를 쿼리 파라미터로 전달
                }
            });

            console.log("AI Response: ", response.data);  // 서버로부터 받은 응답 확인

            // 서버 응답에서 JSON 데이터 추출
            const aiRecipeData = JSON.parse(response.data.split("data:")[1]);

            // AI 추천 레시피 결과가 있는 경우, 해당 내용을 recipeText 상태로 설정
            const aiRecipeText = aiRecipeData.result?.message?.content || '추천된 레시피가 없습니다.';
            setRecipeText(aiRecipeText);

        } catch (error) {
            // 에러 발생 시 상태로 관리하여 사용자에게 표시
            setError(error.message || 'AI 추천 중 오류가 발생했습니다.');
        } finally {
            setLoading(false); // 요청 완료 후 로딩 상태 비활성화
        }
    };

    /**
     * handleInputChange 함수
     * 사용자가 입력한 재료 텍스트를 실시간으로 상태에 저장하고,
     * 입력되는 내용에 따라 textarea의 높이를 자동으로 조정합니다.
     * @param {object} e - 텍스트 입력 이벤트
     */
    const handleInputChange = (e) => {
        const textarea = e.target;
        setIngredients(textarea.value);

        // 텍스트 입력에 따라 textarea의 높이를 자동으로 조정
        textarea.style.height = 'auto'; // 먼저 height를 auto로 설정하여 스크롤이 나타나지 않도록 함
        textarea.style.height = textarea.scrollHeight + 'px'; // 내용에 따라 높이를 설정
    };

    return (
        <div className="ai-recommendation-main">

            {/* 페이지 제목을 표시하는 PageHeader 컴포넌트 */}
            <PageHeader title="BOBPLE AI"/>

            {/* AI 추천 결과가 없고 로딩 중이 아닌 경우 초기 화면을 표시 */}
            {!recipeText && !loading && (
                <div className="ai-recommendation-info">
                    <p>
                        키워드 입력을 통해<br/>
                        AI가 레시피를 제공합니다.
                    </p>
                    <img src="/bobple_mascot.png" alt="밥플이" width={110} height={130}/>
                </div>
            )}

            {/* AI 추천 요청을 위한 폼 */}
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
                {error && <div className="error-message">{error}</div>}  {/* 에러 메시지 표시 */}
                <button type="submit" disabled={!ingredients.trim() || loading}>
                    {loading ? '추천 중...' : '추천 받기'}
                </button>
            </form>

            {/* AI 추천 결과를 화면에 표시 */}
            {recipeText && !loading && (
                <div className="ai-recipe-result">
                    <textarea
                        value={ "🧠레시피추천 AI : "+ "\n" + recipeText} // AI 추천 결과 텍스트
                        readOnly
                        rows={20} // 출력할 텍스트 영역의 줄 수 설정
                        placeholder="AI가 추천하는 레시피가 여기에 표시됩니다."
                        className="ai-recommendation-textarea"
                    />
                </div>
            )}

            {/* 로딩 중인 경우 스피너 표시 */}
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