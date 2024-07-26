// src/components/Recipe/RecipeMain.jsx
import React, { useState, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import RecipeContext from '../../../../../../../Users/thddm/Desktop/Recipe/RecipeContext';
import RecipeList from './RecipeList';
import RecipeDetail from '../../../../../../../Users/thddm/Desktop/Recipe/RecipeDetail';
import RecipeForm from '../../../../../../../Users/thddm/Desktop/Recipe/RecipeForm';
import SearchFilter from '../../../../../../../Users/thddm/Desktop/Recipe/SearchFilter';
import AIRecommendation from '../../../../../../../Users/thddm/Desktop/Recipe/AIRecommendation';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

function RecipeMain() {
    const { recipes, loading, error, searchRecipes, createRecipe } = useContext(RecipeContext);
    const [showForm, setShowForm] = useState(false);

    const handleSearch = (keyword, category) => {
        searchRecipes(keyword, category);
    };

    const handleCreate = () => {
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
    };

    return (
        <div>
            <Segment>
                <Header as="h1" icon textAlign="center">
                    <Icon name="utensils" circular />
                    <Header.Content>레시피 공유</Header.Content>
                </Header>
                <Button primary onClick={handleCreate}>레시피 등록</Button>
            </Segment>
            {showForm && <RecipeForm onClose={handleFormClose} />}

            <SearchFilter onSearch={handleSearch} />

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error.message}</div>
            ) : (
                <RecipeList recipes={recipes} />
            )}

            <Routes>
                <Route path="/:id" element={<RecipeDetail />} />
                <Route path="/ai-recommendation" element={<AIRecommendation />} />
            </Routes>
        </div>
    );
}

export default RecipeMain;
