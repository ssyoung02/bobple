import React, { useState, useContext, useEffect, useRef } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../../assets/style/recipe/RecipeForm.css';
import axios from "../../utils/axios";
import PageHeader from "../../components/layout/PageHeader";
import { Clock, FireIcon, ImageIcon } from "../../components/imgcomponents/ImgComponents";
import { useOnlyHeaderColorChange } from "../../hooks/NavigateComponentHooks";
import mascot from "../../assets/images/bobple_mascot.png";
import { clearRecipeLocalStorage } from "../../utils/localStorageUtils"; // CSS 파일 import

function RecipeForm() {
    const {
        createRecipe,
        updateRecipe,
        selectedRecipe,
        setSelectedRecipe,
        recipeCategory,
    } = useContext(RecipeContext);
    const { recipeIdx } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [calories, setCalories] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [tags, setTags] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);

    // 텍스트 영역의 높이를 제어할 ref
    const ingredientsRef = useRef(null);
    const instructionsRef = useRef(null);
    const tagsRef = useRef(null);

    const location = useLocation();
    useOnlyHeaderColorChange(location.pathname, 'transparent');

    useEffect(() => {
        if (recipeIdx) {
            setIsEditing(true);
            getRecipeById(recipeIdx);
        } else {
            resetForm();
        }
    }, [recipeIdx]);

    // 컴포넌트가 마운트되거나 상태가 변경될 때 textarea의 높이를 조절
    useEffect(() => {
        adjustTextareaHeight(ingredientsRef.current);
        adjustTextareaHeight(instructionsRef.current);
        adjustTextareaHeight(tagsRef.current);
    }, [ingredients, instructions, tags]);

    const resetForm = () => {
        setTitle('');
        setCookTime('');
        setCalories('');
        setIngredients('');
        setInstructions('');
        setTags('');
        setImageFile(null);
        setImageUrl('');
        setCategory('');
        setIsEditing(false);
        setError(null);
    };

    const getRecipeById = async (id) => {
        try {
            const response = await axios.get(`/api/recipes/${id}`);
            setSelectedRecipe(response.data);

            setTitle(response.data.title);
            setCookTime(response.data.cookTime);
            setCalories(response.data.calories);
            setIngredients(response.data.content.split('\n\n만드는 법:\n')[0].replace('재료:', '').trim());
            setInstructions(response.data.content.split('\n\n만드는 법:\n')[1]);
            setTags(response.data.tag || '');
            setImageUrl(response.data.picture || '');
            setCategory(response.data.category || '');
        } catch (error) {
            setError(error.message || '레시피 정보를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImageFile(file);

        // FileReader를 사용하여 이미지 파일을 읽고 미리보기 URL을 생성
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result); // 이미지 미리보기 설정
            document.querySelector('.recipe-header-img').style.background = "#fff";
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const adjustTextareaHeight = (textarea) => {
        if (textarea) {
            textarea.style.height = 'auto'; // 높이를 자동으로 설정
            textarea.style.height = `${textarea.scrollHeight}px`; // 내용에 맞게 높이 조절
        }
    };

    const handleTextareaChange = (e) => {
        const textarea = e.target;
        adjustTextareaHeight(textarea); // 높이 조절 함수 호출
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title || !cookTime || !calories || !ingredients || !instructions || !tags || !category) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        if (!isEditing && !imageFile) {
            alert('레시피 이미지를 업로드해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("cookTime", cookTime);
        formData.append("calories", calories);
        formData.append("ingredients", ingredients);
        formData.append("instructions", instructions);
        formData.append("tag", tags);
        formData.append("category", category);

        if (imageFile) {
            formData.append("image", imageFile); // 새 이미지를 전송
        } else if (isEditing && imageUrl) {
            formData.append("imageUrl", imageUrl); // 기존 이미지 유지
        }

        // formData 내용 출력
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        try {
            if (isEditing) {
                await axios.put(`/api/recipes/${recipeIdx}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                alert('레시피가 성공적으로 수정되었습니다.');
                navigate(`/recipe/${recipeIdx}`);
                localStorage.removeItem('recommendedRecipes');
                console.log("imageUpdateMode : "+ formData.image);
            } else {
                await axios.post("/api/recipes", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('레시피가 성공적으로 등록되었습니다.');

                // 레시피 등록 시 포인트 지급 요청
                await axios.post("/api/point/result/update", {
                    userIdx: Number(localStorage.getItem('userIdx')),
                    point: 1, // 레시피 등록 시 지급할 포인트
                    pointComment: "레시피 등록"}, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });

                localStorage.removeItem('recommendedRecipes');
                navigate(`/recipe`);
                clearRecipeLocalStorage();
                window.location.reload(); // 새로고침
            }
        } catch (error) {
            console.error('레시피 등록/수정 실패:', error);
            alert('레시피 등록/수정에 실패했습니다.');
        }
    };

    return (
        <div className="recipe-form-container">
            <PageHeader title={isEditing ? '레시피 수정' : '레시피 등록'} />
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} id="recipe-form">
                <div className="form-field">
                    <div className="recipe-header-img">
                        <label htmlFor="imageUpload" className="recipe-img-label">
                            <p className="blind">이미지 업로드</p>
                            <ImageIcon/>
                            {!imageUrl ? (
                                <span>레시피 메인 이미지를 업로드해주세요</span>
                            ) : (
                                <span>변경하려는 이미지를 업로드해주세요</span>
                            )}
                        </label>
                        {!imageUrl ? (
                            <></>
                        ):(
                            <img className="recipe-header-exImg"
                                 src={imageUrl || mascot}
                                 alt={title}/>
                        )}
                    </div>
                    <input type="file" id="imageUpload" onChange={handleImageChange} className="blind"/>
                </div>
                <div className="recipe-title-box">
                    <label htmlFor="title" className="blind">제목</label>
                    <input
                        type="text"
                        id="title"
                        className="recipe-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력해주세요"
                    />
                    <div className="recipe-title-item">
                        <div className="recipe-title-item-detail">
                            <label htmlFor="cookTime">
                                <span className="blind">조리 시간 (분)</span>
                                <Clock />
                            </label>
                            <input
                                type="number"
                                id="cookTime"
                                value={cookTime}
                                onChange={(e) => setCookTime(e.target.value)}
                                placeholder="시간"
                            />
                            분
                        </div>
                        <div className="recipe-title-item-detail">
                            <label htmlFor="calories">
                                <span className="blind">칼로리 (kcal)</span>
                                <FireIcon />
                            </label>
                            <input
                                type="number"
                                id="calories"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                placeholder="칼로리"
                            />
                            kcal
                        </div>
                    </div>
                </div>
                <div className="recipe-form-item">
                    <label htmlFor="ingredients">재료</label>
                    <textarea
                        id="ingredients"
                        value={ingredients}
                        ref={ingredientsRef}
                        onChange={(e) => {
                            setIngredients(e.target.value);
                            handleTextareaChange(e); // 높이 조절 함수 호출
                        }}
                        placeholder="재료를 입력해주세요.(쉼표로 구분)"
                        style={{ height: 'auto' }} // 초기 높이 설정
                    />
                </div>
                <div className="recipe-form-item">
                    <label htmlFor="instructions">조리 방법</label>
                    <textarea
                        id="instructions"
                        value={instructions}
                        ref={instructionsRef}
                        onChange={(e) => {
                            setInstructions(e.target.value);
                            handleTextareaChange(e); // 높이 조절 함수 호출
                        }}
                        placeholder="조리 방법을 입력해주세요"
                        style={{ height: 'auto' }} // 초기 높이 설정
                    />
                </div>
                <div className="recipe-form-item">
                    <label htmlFor="tags">태그</label>
                    <textarea
                        type="text"
                        id="tags"
                        value={tags}
                        ref={tagsRef}
                        onChange={(e) => {
                            setTags(e.target.value);
                            handleTextareaChange(e); // 높이 조절 함수 호출
                        }}
                        placeholder="태그를 입력해주세요.(쉼표로 구분)"
                        style={{ height: 'auto' }} // 초기 높이 설정
                    />
                </div>

                <div className="recipe-form-item">
                    <label>카테고리</label>
                    <ul className="recipe-category-list">
                        {recipeCategory.map(categoryList => (
                            <li key={categoryList.name}>
                                <input type="radio" id={categoryList.id} value={categoryList.name} checked={category === categoryList.name}
                                       className="blind"
                                       onChange={(e) => setCategory(e.target.value)} />
                                <label htmlFor={categoryList.id}
                                       className={category === categoryList.name ? "recipe-category-item recipe-select" : "recipe-category-item"}>
                                    {categoryList.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit" className="submit-button">{isEditing ? '수정' : '등록'}</button>
            </form>
        </div>
    );
}

export default RecipeForm;
