// src/components/Recipe/AIRecommendation.jsx
import React, { useState, useContext } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext'; // 경로 수정
import { Form, Input, Button, Segment, Header, Icon } from 'semantic-ui-react';


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
        <Segment>
            <Header as="h2" icon textAlign="center">
                <Icon name="search" circular />
                <Header.Content>AI 레시피 추천</Header.Content>
            </Header>
            <Form onSubmit={handleRecommend}>
                <Form.Field>
                    <Input
                        placeholder="재료를 쉼표로 구분하여 입력하세요. (예: 닭가슴살, 양파, 마늘)"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        loading={loading}
                        error={!!error} // error가 있으면 true로 설정
                    />
                    {error && <div style={{ color: 'red' }}>{error}</div>} {/* 에러 메시지 표시 */}
                </Form.Field>
                <Button type="submit" primary loading={loading} disabled={!ingredients.trim()}>
                    추천 받기
                </Button>
            </Form>
        </Segment>
    );
}

export default AIRecommendation;
