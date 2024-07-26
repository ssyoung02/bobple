// src/components/Recipe/SearchFilter.jsx
import React, { useState, useContext } from 'react';
import RecipeContext from '../Recipe/RecipeContext';
import { Input, Dropdown, Button, Segment, Grid } from 'semantic-ui-react';

function SearchFilter() {
    const { searchRecipes } = useContext(RecipeContext);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('latest'); // 정렬 기준: 최신순 (default)

    const handleSearch = () => {
        searchRecipes(keyword, category, 0, 10, sortBy); // 검색 함수 호출 (페이지 번호, 페이지 크기, 정렬 기준 추가)
    };

    const categoryOptions = [ // 카테고리 옵션 (예시)
        { key: '', text: '전체', value: '' },
        { key: 'korean', text: '한식', value: 'korean' },
        { key: 'chinese', text: '중식', value: 'chinese' },
        { key: 'japanese', text: '일식', value: 'japanese' },
        // ... 필요한 카테고리 추가
    ];

    const sortOptions = [
        { key: 'latest', text: '최신순', value: 'latest' },
        { key: 'popularity', text: '인기순', value: 'popularity' },
        // ... 필요한 정렬 옵션 추가
    ];

    return (
        <Segment>
            <Grid columns={3} stackable textAlign='center'>
                <Grid.Column>
                    <Input
                        icon='search'
                        placeholder='Search...'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Dropdown
                        placeholder='카테고리'
                        selection
                        options={categoryOptions}
                        value={category}
                        onChange={(e, { value }) => setCategory(value)}
                    />
                </Grid.Column>
                <Grid.Column>
                    <Dropdown
                        placeholder='정렬 기준'
                        selection
                        options={sortOptions}
                        value={sortBy}
                        onChange={(e, { value }) => setSortBy(value)}
                    />
                </Grid.Column>
            </Grid>
            <Button primary onClick={handleSearch}>검색</Button>
        </Segment>
    );
}

export default SearchFilter;
