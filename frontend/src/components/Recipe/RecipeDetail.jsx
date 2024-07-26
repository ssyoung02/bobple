// src/components/Recipe/RecipeDetail.jsx
import { Link } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import RecipeContext from '../Recipe/RecipeContext';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeComment from './RecipeComment.jsx'; // 확장자(.jsx)를 포함한 경로로 수정
import { Button, Header, Icon, Segment, Image, Container, Comment, Form } from 'semantic-ui-react';


function RecipeDetail() {
    const { recipeIdx } = useParams();
    const { getRecipeById, selectedRecipe, loading, error, likeRecipe } = useContext(RecipeContext);
    const navigate = useNavigate();

    useEffect(() => {
        getRecipeById(recipeIdx);
    }, [recipeIdx, getRecipeById]);

    const handleLikeClick = () => {
        likeRecipe(recipeIdx);
    };

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('정말로 레시피를 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                // TODO: 백엔드 API 호출하여 레시피 삭제 구현 (deleteRecipe 함수 사용)
                // 성공적으로 삭제되면 목록 페이지로 이동
                navigate('/recipe');
            } catch (error) {
                console.error('레시피 삭제 실패:', error);
                alert('레시피 삭제에 실패했습니다.');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!selectedRecipe) return <div>Recipe not found.</div>;

    return (
        <div>
            <Segment>
                <Header as="h1" icon textAlign="center">
                    <Icon name="utensils" circular />
                    <Header.Content>{selectedRecipe.title}</Header.Content>
                </Header>
            </Segment>
            <Container text>
                <Image src={selectedRecipe.picture} size='large' centered />
                <p>작성자: {selectedRecipe.nickname}</p>
                <p>작성 시간: {selectedRecipe.createdAt}</p>
                <h3>재료:</h3>
                <ul>
                    {selectedRecipe.content.split(',').map((ingredient, index) => (
                        <li key={index}>{ingredient.trim()}</li>
                    ))}
                </ul>
                <h3>조리 방법:</h3>
                <p>{selectedRecipe.content.split('\n\n만드는 법:\n')[1]}</p>
                {/* 좋아요 버튼 */}
                <Button onClick={handleLikeClick}>
                    {selectedRecipe.liked ? '좋아요 취소' : '좋아요'} ({selectedRecipe.likesCount})
                </Button>
                {/* 수정 버튼 */}
                <Button as={Link} to={`/recipe/edit/${recipeIdx}`} primary>수정</Button>
                {/* 삭제 버튼 */}
                <Button onClick={handleDeleteClick} negative>삭제</Button>
                <Comment.Group>
                    {selectedRecipe.comments.map(comment => (
                        <RecipeComment key={comment.recipeCommentIdx} comment={comment} /> // 댓글 컴포넌트
                    ))}
                </Comment.Group>
            </Container>
        </div>
    );
}
export default RecipeDetail;
