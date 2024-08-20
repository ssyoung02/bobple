// src/components/Recipe/RecipeModify.jsx
import React, {  useContext, useEffect } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeForm from './RecipeForm';
import '../../assets/style/recipe/RecipeModify.css';
import {ClipLoader} from "react-spinners"; // CSS 파일 import

/**
 * RecipeModify 컴포넌트
 * 이 컴포넌트는 기존 레시피를 수정하는 기능을 제공하며, 레시피 정보를 불러와 수정 폼(RecipeForm)에 전달한다.
 */
function RecipeModify() {
    const { recipeIdx } = useParams(); // URL 파라미터에서 recipeIdx 추출
    const { getRecipeById, selectedRecipe, updateRecipe } = useContext(RecipeContext); // 컨텍스트에서 필요한 함수 및 상태 가져오기
    const navigate = useNavigate(); // 페이지 이동을 위한 훅


    /**
     * 컴포넌트가 처음 렌더링될 때 또는 recipeIdx가 변경될 때 해당 레시피의 데이터를 서버에서 불러온다.
     * 이 데이터를 RecipeForm 컴포넌트에 전달하여 수정 폼에 미리 채워지도록 한다.
     */
    useEffect(() => {
        if (recipeIdx) {  // 레시피 ID가 존재하는 경우
            getRecipeById(recipeIdx); // 레시피 데이터를 서버에서 가져옴
        }
    }, [recipeIdx, getRecipeById]); // recipeIdx 또는 getRecipeById가 변경될 때마다 실행

    /**
     * 레시피 수정 폼 제출 핸들러
     * 레시피 데이터를 받아 서버에 업데이트 요청을 보낸다.
     * 수정이 성공하면 레시피 상세 페이지로 이동하고, 실패 시 에러 메시지를 표시한다.
     * @param {Object} recipeData - 수정된 레시피 데이터
     */
    const handleSubmit = async (recipeData) => {
        try {
            await updateRecipe(recipeIdx, recipeData); // 서버에 수정된 레시피 데이터를 업데이트
            alert('레시피가 성공적으로 수정되었습니다.');
            navigate(`/recipe/${recipeIdx}`); // 수정 후 해당 레시피의 상세 페이지로 이동
        } catch (error) {
            console.error('레시피 수정 실패:', error); // 에러 발생 시 콘솔에 에러 로그 출력
            alert('레시피 수정에 실패했습니다.');
        }
    };

    return (
        <div className="recipe-modify-container">
            {/* 선택된 레시피가 없을 경우 로딩 메시지 출력, 있으면 RecipeForm 렌더링 */}
            {!selectedRecipe ? (
                <div className="loading-spinner slider">
                    <ClipLoader size={50} color={"#123abc"} />
                </div>
            ) : (
                <RecipeForm initialRecipe={selectedRecipe} onSubmit={handleSubmit}/>
            )} {/* RecipeForm에 불러온 레시피 데이터를 전달 */}
        </div>
    );
}

export default RecipeModify;
