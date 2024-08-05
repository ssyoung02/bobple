// // src/components/Recipe/RecipeDetail.jsx
// import React, { useContext,useState, useEffect } from 'react';
// import RecipeContext from '../../pages/recipe/RecipeContext';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import RecipeComment from './RecipeComment';
// import axios from "../../utils/axios";
// import '../../assets/style/recipe/RecipeDetail.css';
//
// function RecipeDetail() {
//     const { recipeIdx } = useParams();
//     const {
//         getRecipeById,
//         selectedRecipe,
//         loading,
//         error,
//         likeRecipe,
//         deleteRecipe,
//         setSelectedRecipe,  // 추가
//         setError, // 추가
//         createComment
//     } = useContext(RecipeContext);
//     const [comments, setComments] = useState([]);
//     const [newComment, setNewComment] = useState('');
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         getRecipeById(recipeIdx);
//         axios.get(`/api/recipes/${recipeIdx}/comments`) // 댓글 목록을 별도로 가져오는 API 호출
//             .then(response => {
//                 // 가져온 댓글 목록을 selectedRecipe에 추가
//                 setSelectedRecipe(prevRecipe => ({
//                     ...prevRecipe,
//                     comments: response.data
//                 }));
//             })
//             .catch(error => {
//                 setError(error.message || '댓글 목록을 불러오는 중 오류가 발생했습니다.');
//             });
//     }, [recipeIdx, getRecipeById, setError, setSelectedRecipe]); // 의존성 추가
//
//     useEffect(() => {
//         const fetchRecipe = async () => {
//             try {
//                 await getRecipeById(recipeIdx);
//             } catch (error) {
//                 setError(error.message || '레시피를 불러오는 중 오류가 발생했습니다.');
//             }
//         };
//
//         fetchRecipe();
//     }, [recipeIdx, getRecipeById, setError]);
//
//     useEffect(() => {
//         const fetchComments = async () => {
//             try {
//                 const response = await axios.get(`/api/recipes/${recipeIdx}/comments`);
//                 setComments(response.data);
//             } catch (error) {
//                 setError(error.message || '댓글을 불러오는 중 오류가 발생했습니다.');
//             }
//         };
//
//         fetchComments();
//     }, [recipeIdx, setError]);
//
//     const handleCommentSubmit = async () => {
//         try {
//             await createComment(recipeIdx, newComment);
//             setNewComment('');
//             // 댓글을 새로고침하여 반영
//             const response = await axios.get(`/api/recipes/${recipeIdx}/comments`);
//             setComments(response.data);
//         } catch (error) {
//             setError(error.message || '댓글 작성 중 오류가 발생했습니다.');
//         }
//     };
//
//     if (!selectedRecipe) {
//         return <div>Loading...</div>;
//     }
//
//
//
//     const handleLikeClick = () => {
//         likeRecipe(recipeIdx);
//     };
//
//     const handleDeleteClick = async () => {
//         const confirmDelete = window.confirm('정말로 레시피를 삭제하시겠습니까?');
//         if (confirmDelete) {
//             try {
//                 await deleteRecipe(recipeIdx); // deleteRecipe 함수 호출
//                 navigate('/recipe'); // 삭제 후 레시피 목록 페이지로 이동
//             } catch (error) {
//                 console.error('레시피 삭제 실패:', error);
//                 alert('레시피 삭제에 실패했습니다.');
//             }
//         }
//     };
//
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error.message}</div>;
//     if (!selectedRecipe) return (
//         <div className="recipe-detail-container">
//             <h2>레시피 상세</h2>
//             <div className="recipe-not-found">
//                 레시피를 찾을 수 없습니다.
//             </div>
//         </div>
//     );
//
//     // 사용자 닉네임 가져오기 (예시)
//     const userNickname = localStorage.getItem('userNickname'); // 실제 구현에서는 백엔드에서 유저 정보를 가져와야 합니다.
//     console.log(selectedRecipe);
//     return (
//         <div>
//             {selectedRecipe && ( // selectedRecipe가 존재하는 경우에만 렌더링
//                 <>
//                     <h2>{selectedRecipe.title}</h2>
//                     <div className="recipe-info">
//                         <p>작성자: {selectedRecipe.nickname}</p>
//                         <p>작성 시간: {selectedRecipe.createdAt}</p>
//                     </div>
//                     <img src={selectedRecipe.picture || '/images/default_recipe_image.jpg'} alt={selectedRecipe.title}
//                          className="recipe-image"/>
//                     <h3>재료:</h3>
//                     <ul>
//                         {selectedRecipe.content &&
//                             selectedRecipe.content.split(',').map((ingredient, index) => ( // selectedRecipe.content 존재 여부 확인
//                                 <li key={index}>{ingredient.trim()}</li>
//                             ))}
//                     </ul>
//                     <h3>조리 방법:</h3>
//                     {selectedRecipe.content && ( // selectedRecipe.content 존재 여부 확인
//                         <p>{selectedRecipe.content.split('\n\n만드는 법:\n')[1] || '조리 방법이 없습니다.'}</p> // 조리 방법이 없는 경우 메시지 표시
//                     )}
//
//                     {/* 좋아요 버튼 */}
//                     <button className="like-button" onClick={handleLikeClick}>
//                         {selectedRecipe.liked ? '좋아요 취소' : '좋아요'} ({selectedRecipe.likesCount})
//                     </button>
//
//                     {/* 수정 버튼 (작성자만 보이도록 조건 추가) */}
//                     {userNickname === selectedRecipe.nickname && (
//                         <Link to={`/recipe/edit/${recipeIdx}`}>
//                             <button className="edit-button">수정</button>
//                         </Link>
//                     )}
//
//                     {/* 삭제 버튼 (작성자만 보이도록 조건 추가) */}
//                     {userNickname === selectedRecipe.nickname && (
//                         <button className="delete-button" onClick={handleDeleteClick}>삭제</button>
//                     )}
//
//                     <div className="comment-section">
//                         <h3>댓글</h3>
//                         {comments.map(comment => (
//                             <RecipeComment key={comment.recipeCommentIdx} comment={comment}/>
//                         ))}
//                         <div className="comment-input">
//                     <textarea
//                         value={newComment}
//                         onChange={(e) => setNewComment(e.target.value)}
//                         placeholder="댓글을 입력하세요"
//                     />
//                             <button onClick={handleCommentSubmit}>댓글 작성</button>
//                         </div>
//                     </div>
//                 </>
//             )}
//
//             {!selectedRecipe && loading && <div>Loading...</div>} {/* 로딩 중일 때 메시지 표시 */}
//             {!selectedRecipe && !loading && <div>Recipe not found.</div>} {/* 레시피를 찾을 수 없는 경우 */}
//         </div>
//     );
// }
//
// export default RecipeDetail;
import React, { useContext, useState, useEffect, useCallback } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RecipeComment from './RecipeComment';
import axios from "../../utils/axios";
import '../../assets/style/recipe/RecipeDetail.css';

function RecipeDetail() {
    const { recipeIdx } = useParams();
    const {
        getRecipeById,
        selectedRecipe,
        loading,
        error,
        likeRecipe,
        deleteRecipe,
        setSelectedRecipe,
        setError,
        createComment
    } = useContext(RecipeContext);
    const [newComment, setNewComment] = useState('');
    const navigate = useNavigate();

    const fetchRecipeAndComments = useCallback(async () => {
        try {
            await getRecipeById(recipeIdx);
            const response = await axios.get(`/api/recipes/${recipeIdx}/comments`);
            setSelectedRecipe(prevRecipe => ({
                ...prevRecipe,
                comments: response.data
            }));
        } catch (error) {
            setError(error.message || '데이터를 불러오는 중 오류가 발생했습니다.');
        }
    }, [recipeIdx, getRecipeById, setError, setSelectedRecipe]);

    useEffect(() => {
        fetchRecipeAndComments();
    }, [fetchRecipeAndComments]);


    const handleCommentSubmit = async () => {
        try {
            await createComment(recipeIdx, newComment);
            setNewComment('');
            const response = await axios.get(`/api/recipes/${recipeIdx}/comments`);
            setSelectedRecipe(prevRecipe => ({
                ...prevRecipe,
                comments: response.data
            }));
        } catch (error) {
            setError(error.message || '댓글 작성 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!selectedRecipe) return (
        <div className="recipe-detail-container">
            <h2>레시피 상세</h2>
            <div className="recipe-not-found">
                레시피를 찾을 수 없습니다.
            </div>
        </div>
    );

    const handleLikeClick = () => {
        likeRecipe(recipeIdx);
    };

    const handleDeleteClick = async () => {
        const confirmDelete = window.confirm('정말로 레시피를 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await deleteRecipe(recipeIdx);
                navigate('/recipe');
            } catch (error) {
                console.error('레시피 삭제 실패:', error);
                alert('레시피 삭제에 실패했습니다.');
            }
        }
    };

    // 사용자 닉네임 가져오기 (예시)
    const userNickname = localStorage.getItem('userNickname'); // 실제 구현에서는 백엔드에서 유저 정보를 가져와야 합니다.

    return (
        <div>
            {selectedRecipe && (
                <>
                    <h2>{selectedRecipe.title}</h2>
                    <div className="recipe-info">
                        <p>작성자: {selectedRecipe.nickname}</p>
                        <p>작성 시간: {selectedRecipe.createdAt}</p>
                    </div>
                    <img src={selectedRecipe.picture || '/images/default_recipe_image.jpg'} alt={selectedRecipe.title}
                         className="recipe-image"/>
                    <h3>재료:</h3>
                    <ul>
                        {selectedRecipe.content &&
                            selectedRecipe.content.split(',').map((ingredient, index) => (
                                <li key={index}>{ingredient.trim()}</li>
                            ))}
                    </ul>
                    <h3>조리 방법:</h3>
                    {selectedRecipe.content && (
                        <p>{selectedRecipe.content.split('\n\n만드는 법:\n')[1] || '조리 방법이 없습니다.'}</p>
                    )}

                    {/* 좋아요 버튼 */}
                    <button className="like-button" onClick={handleLikeClick}>
                        {selectedRecipe.liked ? '좋아요 취소' : '좋아요'} ({selectedRecipe.likesCount})
                    </button>

                    {/* 수정 버튼 (작성자만 보이도록 조건 추가) */}
                    {userNickname === selectedRecipe.nickname && (
                        <Link to={`/recipe/edit/${recipeIdx}`}>
                            <button className="edit-button">수정</button>
                        </Link>
                    )}

                    {/* 삭제 버튼 (작성자만 보이도록 조건 추가) */}
                    {userNickname === selectedRecipe.nickname && (
                        <button className="delete-button" onClick={handleDeleteClick}>삭제</button>
                    )}

                    <div className="comment-section">
                        <h3>댓글</h3>
                        {selectedRecipe.comments && selectedRecipe.comments.map(comment => (
                            <RecipeComment key={comment.recipeCommentIdx} comment={comment} />
                        ))}
                        <div className="comment-input">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="댓글을 입력하세요"
                            />
                            <button onClick={handleCommentSubmit}>댓글 작성</button>
                        </div>
                    </div>
                </>
            )}

            {!selectedRecipe && loading && <div>Loading...</div>}
            {!selectedRecipe && !loading && <div>Recipe not found.</div>}
        </div>
    );
}

export default RecipeDetail;
