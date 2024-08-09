import React, {useState, useContext, useEffect} from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import {useParams, useNavigate} from 'react-router-dom';
import '../../assets/style/recipe/RecipeForm.css';
import axios from "../../utils/axios";

function RecipeForm() {
    const {createRecipe, updateRecipe, selectedRecipe, setSelectedRecipe} = useContext(RecipeContext);
    const {recipeIdx} = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [calories, setCalories] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [tags, setTags] = useState('');
    const [imageFile, setImageFile] = useState(null); // 추가: 이미지 파일 상태
    const [imageUrl, setImageUrl] = useState(''); // Define imageUrl state here
    const [category, setCategory] = useState(''); // 추가: 카테고리 상태
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (recipeIdx) { // 레시피 수정 모드일 때
            setIsEditing(true);
            getRecipeById(recipeIdx);
        } else {
            // 레시피 작성 모드일 때 초기화
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
        setImageUrl(''); // Reset imageUrl
        setCategory(''); // 카테고리 초기화
        setIsEditing(false);
        setError(null);
    };

    const getRecipeById = async (id) => {
        try {
            const response = await axios.get(`/api/recipes/${id}`);
            setSelectedRecipe(response.data);

            // 폼 필드 초기값 설정
            setTitle(response.data.title);
            setCookTime(response.data.cookTime);
            setCalories(response.data.calories);
            setIngredients(response.data.content.split('\n\n만드는 법:\n')[0].replace('재료:', '').trim());
            setInstructions(response.data.content.split('\n\n만드는 법:\n')[1]);
            setTags(response.data.tag || '');
            setImageUrl(response.data.picture || '');
            setCategory(response.data.category || ''); // 기존 카테고리 값 설정
        } catch (error) {
            setError(error.message || '레시피 정보를 불러오는 중 오류가 발생했습니다.');
        }
    };

    const handleImageChange = (event) => {
        setImageFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 입력값 유효성 검사
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
            formData.append("category", category); // 카테고리 추가

            if (imageFile) {
                formData.append("image", imageFile);
            }
            if (isEditing) {
                await axios.put(`/api/recipes/${recipeIdx}`, formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
                alert('레시피가 성공적으로 수정되었습니다.');
                navigate(`/recipe/${recipeIdx}`);
            } else {
                await axios.post("/api/recipes", formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
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
            <h2>{isEditing ? '레시피 수정' : '레시피 등록'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="title">제목</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className="form-field">
                    <label htmlFor="cookTime">조리 시간 (분)</label>
                    <input type="number" id="cookTime" value={cookTime} onChange={(e) => setCookTime(e.target.value)}/>
                </div>
                <div className="form-field">
                    <label htmlFor="calories">칼로리 (kcal)</label>
                    <input type="number" id="calories" value={calories} onChange={(e) => setCalories(e.target.value)}/>
                </div>
                <div className="form-field">
                    <label htmlFor="ingredients">재료 (쉼표로 구분)</label>
                    <textarea id="ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)}/>
                </div>
                <div className="form-field">
                    <label htmlFor="instructions">조리 방법</label>
                    <textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)}/>
                </div>
                <div className="form-field">
                    <label htmlFor="tags">태그 (쉼표로 구분)</label>
                    <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)}/>
                </div>
                <div className="form-field">
                    <label>카테고리</label>
                    <div>
                        <input type="radio" id="hansik" value="hansik" checked={category === '한식'}
                               onChange={(e) => setCategory(e.target.value)}/>
                        <label htmlFor="hansik">한식</label>
                    </div>
                    <div>
                        <input type="radio" id="yangsik" value="yangsik" checked={category === '양식'}
                               onChange={(e) => setCategory(e.target.value)}/>
                        <label htmlFor="yangsik">양식</label>
                    </div>
                    <div>
                        <input type="radio" id="yilsik" value="yilsik" checked={category === '일식'}
                               onChange={(e) => setCategory(e.target.value)}/>
                        <label htmlFor="yilsik">일식</label>
                    </div>
                    <div>
                        <input type="radio" id="jungsik" value="jungsik" checked={category === '중식'}
                               onChange={(e) => setCategory(e.target.value)}/>
                        <label htmlFor="중식">중식</label>
                    </div>
                </div>
                <div className="form-field">
                    <label htmlFor="imageUpload">이미지 업로드</label>
                    <input type="file" id="imageUpload" onChange={handleImageChange}/>
                </div>
                <button type="submit" className="submit-button">{isEditing ? '수정' : '등록'}</button>
            </form>
        </div>
    );
}

export default RecipeForm;
