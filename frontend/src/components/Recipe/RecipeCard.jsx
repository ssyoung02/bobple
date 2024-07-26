import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Image } from 'semantic-ui-react';

function RecipeCard({ recipe }) {
    return (
        <Card as={Link} to={`/recipe/${recipe.recipeIdx}`} fluid>
            <Image src={recipe.picture} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{recipe.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>작성자: {recipe.nickname}</span>
                </Card.Meta>
                <Card.Description>
                    {/* 레시피 내용 일부 표시 (생략) */}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='heart' />
                {recipe.likesCount} 좋아요
            </Card.Content>
        </Card>
    );
}

export default RecipeCard;
