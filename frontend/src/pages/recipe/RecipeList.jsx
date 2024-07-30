// src/components/Recipe/RecipeList.jsx
import React, { useContext, useEffect } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext'; // RecipeContext 경로 수정
import RecipeCard from './RecipeCard'; // RecipeCard 경로 수정
import { Grid, Message } from 'semantic-ui-react'; // Message 컴포넌트 추가

function RecipeList() {
    const { recipes, loading, error, searchRecipes, getRecipeById, totalElements, totalPages, page, changePage } = useContext(RecipeContext); // totalPages 추가

    useEffect(() => {
        searchRecipes('', '', page, 10); // 초기 레시피 목록 로드 (검색어, 카테고리 빈 값으로 전달)
    }, [searchRecipes, page]); // 페이지 번호가 변경될 때마다 다시 로드

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
            ) : totalElements === 0 ? ( // 전체 레시피 개수가 0인 경우
                <Message warning>
                    <Message.Header>레시피가 존재하지 않아요</Message.Header>
                    <p>새로운 레시피를 작성해보세요!</p>
                </Message>
            ) : (
                <>
                    <Grid columns={3} divided>
                        {recipes.map(recipe => (
                            <Grid.Column key={recipe.recipeIdx} onClick={() => handleRecipeClick(recipe.recipeIdx)}>
                                <RecipeCard recipe={recipe} />
                            </Grid.Column>
                        ))}
                    </Grid>
                    {/* 페이지네이션 추가 */}
                    <div>
                        <button onClick={() => changePage(page - 1)} disabled={page === 0}>이전</button>
                        <span>{page + 1} / {totalPages}</span>
                        <button onClick={() => changePage(page + 1)} disabled={page === totalPages - 1}>다음</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default RecipeList;