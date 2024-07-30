// src/components/Recipe/RecipeForm.jsx
import React, { useState, useContext } from 'react';
import { Header } from 'semantic-ui-react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import { Form, Input, TextArea, Button, Image, Segment } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

function RecipeForm({ onClose }) {
    const { createRecipe } = useContext(RecipeContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 입력값 유효성 검사
        if (!title || !ingredients || !instructions) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            await createRecipe({ title, ingredients, instructions, picture: imageUrl });
            alert('레시피가 성공적으로 등록되었습니다.');
            navigate('/recipe'); // 등록 후 목록 페이지로 이동
            onClose(); // 폼 닫기 (필요한 경우)
        } catch (error) {
            console.error('레시피 등록 실패:', error);
            alert('레시피 등록에 실패했습니다.');
        }
    };

    return (
        <Segment>
            <Header as="h2">레시피 등록</Header> {/* 헤더 변경 */}
            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>제목</label>
                    <Input placeholder='제목' value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>재료 (쉼표로 구분)</label>
                    <Input placeholder='재료' value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>조리 방법</label>
                    <TextArea placeholder='조리 방법' value={instructions} onChange={(e) => setInstructions(e.target.value)} />
                </Form.Field>
                <Form.Field>
                    <label>이미지 URL</label>
                    <Input placeholder='이미지 URL' value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                    {imageUrl && <Image src={imageUrl} size='small' />}
                </Form.Field>
                <Button type='submit' primary>등록</Button> {/* 버튼 변경 */}
            </Form>
        </Segment>
    );
}

export default RecipeForm;
