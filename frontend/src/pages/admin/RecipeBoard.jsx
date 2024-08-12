import React, { useState, useEffect } from 'react';
import '../../assets/style/admin/RecipeBoard.css';
import { useNavigate } from "react-router-dom";
import mascot from '../../assets/images/bobple_mascot.png';
import axios from 'axios';

const RecipeBoard = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRecipes, setSelectedRecipes] = useState([]);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending
    const itemsPerPage = 20;
    const navigate = useNavigate();

    // Fetch recipe data from the server
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/admin/recipes');
                setRecipes(response.data || []); // Ensure recipes is at least an empty array
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };

        fetchRecipes();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleDelete = (id) => {
        setRecipes(recipes.filter(recipe => recipe.recipeIdx !== id));
        setCurrentPage(1);
    };

    const handleSelectRecipe = (id) => {
        setSelectedRecipes(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(recipeId => recipeId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedRecipes.length === 0) return;

        // 사용자에게 삭제 확인 메시지를 보여줍니다.
        const confirmDelete = window.confirm('선택한 레시피를 삭제하시겠습니까?');
        if (!confirmDelete) return;

        try {
            // Send delete request for each selected recipe
            await Promise.all(
                selectedRecipes.map(async (id) => {
                    await axios.delete(`http://localhost:8080/api/admin/recipes/${id}`);
                })
            );

            // Remove successfully deleted recipes from local state
            setRecipes(recipes.filter(recipe => !selectedRecipes.includes(recipe.recipeIdx)));
            setSelectedRecipes([]); // Clear selected recipes
            setCurrentPage(1); // Reset to first page after deletion
        } catch (error) {
            console.error("Error deleting recipes:", error);
        }
    };

    // Handle sorting
    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };

    // Sort and filter data
    const sortedRecipes = [...recipes].sort((a, b) => {
        if (!sortField) return 0; // No sorting
        const order = sortOrder === 'asc' ? 1 : -1;
        return (a[sortField] > b[sortField] ? 1 : -1) * order;
    });

    const filteredRecipes = sortedRecipes.filter(recipe =>
        (recipe.nickname && recipe.nickname.includes(searchTerm)) ||
        (recipe.title && recipe.title.includes(searchTerm))
    );

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRecipes.slice(indexOfFirstItem, indexOfLastItem);

    const handleClick = (event) => {
        setCurrentPage(Number(event.target.id));
    };

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 5, 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 5, Math.ceil(filteredRecipes.length / itemsPerPage)));
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(filteredRecipes.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }
        const startPage = Math.floor((currentPage - 1) / 5) * 5;
        return (
            <>
                <button onClick={handlePrev}>{'<<'}</button>
                {pageNumbers.slice(startPage, startPage + 5).map(number => (
                    <button
                        key={number}
                        id={number}
                        onClick={handleClick}
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}
                <button onClick={handleNext}>{'>>'}</button>
            </>
        );
    };

    return (
        <div className="admin-form-container-r">
            <div className="left-section">
                <button className="nav-button-r info" onClick={() => navigate('../userInfo')}>회원 정보</button>
                <button className="nav-button-r recipe" onClick={() => navigate('../recipeBoard')}>게시글 관리</button>
                <button className="nav-button-r notice" onClick={() => navigate('../notice')}>공지 사항</button>
                <button className="nav-button-r qna" onClick={() => navigate('../qnAList')}>문의 사항</button>
                <img src={mascot} alt="밥풀이" className="admin-image"/>
            </div>

            <div className="right-section">
                <div className="right-header">
                    <h2 className="section-title">레시피 관리</h2>
                    <button onClick={() => navigate('/mypage/login')} className="back-app-btn">x</button>
                </div>
                <div className="admin-search-bar">
                    <input
                        className="admin-search-input"
                        type="text"
                        placeholder="레시피 제목 또는 작성자 이름을 입력해주세요."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>선택</th>
                            <th>레시피 번호</th>
                            <th>작성자 이름</th>
                            <th>제목</th>
                            <th>카테고리</th>
                            <th onClick={() => handleSort('likesCount')}>좋아요 수 {sortField === 'likesCount' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                            <th onClick={() => handleSort('reportCount')}>신고 수 {sortField === 'reportCount' && (sortOrder === 'asc' ? '▲' : '▼')}</th>
                            <th>생성일</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map(recipe => (
                            <tr key={recipe.recipeIdx}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedRecipes.includes(recipe.recipeIdx)}
                                        onChange={() => handleSelectRecipe(recipe.recipeIdx)}
                                        className="select-input"
                                    />
                                </td>
                                <td>{recipe.recipeIdx}</td>
                                <td>{recipe.nickname}</td>
                                <td>{recipe.title}</td>
                                <td>{recipe.category}</td>
                                <td>{recipe.likesCount}</td>
                                <td>{recipe.reportCount}</td>
                                <td>{recipe.createdAt.split('T')[0]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="pagination-container">
                    <div className="pagination">
                        {renderPageNumbers()}
                    </div>
                    <button
                        onClick={handleDeleteSelected}
                        disabled={selectedRecipes.length === 0}
                        className="admin-delete-button"
                    >
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeBoard;
