// src/components/Recipe/RecipeList.jsx
import React, { useContext, useEffect } from 'react';
import RecipeContext from '../../../../../../../Users/thddm/Desktop/Recipe/RecipeContext';
import RecipeCard from '../../../../../../../Users/thddm/Desktop/Recipe/RecipeCard';
import { Grid } from 'semantic-ui-react';

function RecipeList() {
    const { recipes, loading, error, searchRecipes, getRecipeById } = useContext(RecipeContext);

    useEffect(() => {
        searchRecipes('', ''); // 초기 레시피 목록 로드 (검색어, 카테고리 빈 값으로 전달)
    }, [searchRecipes]); // searchRecipes 함수가 변경될 때마다 useEffect 실행

    // 레시피 클릭 시 상세 페이지로 이동
    const handleRecipeClick = (recipeId) => {
        getRecipeById(recipeId); // 레시피 상세 정보 가져오기
        window.scrollTo(0, 0); // 스크롤 맨 위로 이동
    };

    return (
        <div>
            {loading ? (
                <div>Loading...</div> // 로딩 중일 때 메시지 표시
            ) : error ? (
                <div>Error: {error.message}</div> // 에러 발생 시 메시지 표시
            ) : recipes.length === 0 ? (
                <div>레시피가 없습니다.</div> // 레시피가 없을 때 메시지 표시
            ) : (
                <Grid columns={3} divided>
                    {recipes.map(recipe => (
                        <Grid.Column key={recipe.recipeIdx} onClick={() => handleRecipeClick(recipe.recipeIdx)}>
                            <RecipeCard recipe={recipe} />
                        </Grid.Column>
                    ))}
                </Grid>
            )}
        </div>
    );
}

export default RecipeList;
