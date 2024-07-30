import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, Image, Icon } from 'semantic-ui-react';
import RecipeContext from '../../pages/recipe/RecipeContext';

function RecipeCard({ recipe }) {
    const { likeRecipe } = useContext(RecipeContext);

    const handleLikeClick = () => {
        likeRecipe(recipe.recipeIdx);
    };

    return (
        <Card as={Link} to={`/recipe/${recipe.recipeIdx}`} fluid>
            <Image
                src={recipe.picture || '/images/default_recipe_image.jpg'}
                onError={(e) => { e.target.onerror = null; e.target.src = '/images/error_image.jpg' }}
                wrapped
                ui={false}
            />
            <Card.Content>
                <Card.Header>{recipe.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>작성자: {recipe.nickname}</span>
                </Card.Meta>
                <Card.Description>
                    {recipe.content.length > 100 ? recipe.content.slice(0, 100) + "..." : recipe.content}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='heart' color={recipe.liked ? 'red' : 'grey'} onClick={handleLikeClick} />
                {recipe.likesCount} 좋아요
            </Card.Content>
        </Card>
    );
}

export default RecipeCard;
