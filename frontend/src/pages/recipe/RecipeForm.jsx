import React, { useState, useContext, useEffect } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../../assets/style/recipe/RecipeForm.css';
import axios from "../../utils/axios";
import PageHeader from "../../components/layout/PageHeader";
import { Clock, FireIcon, ImageIcon } from "../../components/imgcomponents/ImgComponents";
import { useOnlyHeaderColorChange } from "../../hooks/NavigateComponentHooks";

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
            document.querySelector('.recipe-header-img').style.background="#fff";
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!title || !cookTime || !calories || !ingredients || !instructions || !tags || !category) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("cookTime", cookTime);
            formData.append("calories", calories);
            formData.append("ingredients", ingredients);
            formData.append("instructions", instructions);
            formData.append("tag", tags);
            formData.append("category", category);

            if (imageFile) {
                formData.append("image", imageFile);
            }
            if (isEditing) {
                await axios.put(`/api/recipes/${recipeIdx}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('레시피가 성공적으로 수정되었습니다.');
                navigate(`/recipe/${recipeIdx}`);
            } else {
                await axios.post("/api/recipes", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('레시피가 성공적으로 등록되었습니다.');
                navigate('/recipe');
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
                                 src={imageUrl || '/images/default_recipe_image.jpg'}
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
                            <label htmlFor="calories" className="blind">
                                <span className="blind">
                                    칼로리 (kcal)
                                </span>
                                <FireIcon />
                            </label>
                            <input
                                type="number"
                                id="calories"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                placeholder="칼로리"
                            />
                            Kcal
                        </div>
                    </div>
                </div>
                <div className="recipe-form-item">
                    <label htmlFor="ingredients">재료</label>
                    <textarea
                        id="ingredients"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="재료를 입력해주세요.(쉼표로 구분)"
                    />
                </div>
                <div className="recipe-form-item">
                    <label htmlFor="instructions">조리 방법</label>
                    <textarea
                        id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)}
                        placeholder="조리 방법을 입력해주세요"
                    />
                </div>
                <div className="recipe-form-item">
                    <label htmlFor="tags">태그</label>
                    <textarea
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="태그를 입력해주세요.(쉼표로 구분)"
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
