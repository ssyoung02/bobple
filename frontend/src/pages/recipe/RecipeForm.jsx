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

/**
 * RecipeForm 컴포넌트
 * 레시피를 등록하거나 수정할 수 있는 폼 컴포넌트로, 입력된 정보에 따라 레시피를 서버로 전송한다.
 * 레시피 등록 시 이미지 업로드, 기본 정보 입력, 재료, 조리 방법, 태그, 카테고리 선택 등의 기능을 제공.
 */
function RecipeForm() {
    const {
        setSelectedRecipe,
        recipeCategory,
    } = useContext(RecipeContext); // 컨텍스트에서 레시피 상태와 카테고리 목록 가져오기
    const { recipeIdx } = useParams();  // URL 파라미터에서 recipeIdx를 가져와, 레시피가 수정 모드인지 등록 모드인지 확인
    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const location = useLocation();  // 현재 경로 정보를 제공하는 훅
    useOnlyHeaderColorChange(location.pathname, 'transparent');

    // 각 필드의 상태 정의 (제목, 시간, 칼로리, 재료, 방법, 태그, 이미지, 카테고리)
    const [title, setTitle] = useState('');
    const [cookTime, setCookTime] = useState('');
    const [calories, setCalories] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [tags, setTags] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('');
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
    const [error, setError] = useState(null);  // 에러 메시지 상태

    /**
     * 컴포넌트가 처음 로드될 때 레시피를 수정할지 새로 등록할지를 결정.
     * 수정 모드일 경우 기존 레시피 정보를 서버에서 가져와 폼에 채움.
     */
    // 텍스트 영역의 높이를 제어할 ref
    const ingredientsRef = useRef(null);
    const instructionsRef = useRef(null);
    const tagsRef = useRef(null);

    useEffect(() => {
        if (recipeIdx) { // 레시피 ID가 존재하면 수정 모드로 전환
            setIsEditing(true);
            getRecipeById(recipeIdx);
        } else {
            resetForm(); // 레시피 ID가 없으면 폼 초기화
        }
    }, [recipeIdx]);

    // 컴포넌트가 마운트되거나 상태가 변경될 때 textarea의 높이를 조절
    useEffect(() => {
        adjustTextareaHeight(ingredientsRef.current);
        adjustTextareaHeight(instructionsRef.current);
        adjustTextareaHeight(tagsRef.current);
    }, [ingredients, instructions, tags]);

    /**
     * 폼을 초기 상태로 리셋하는 함수
     * 레시피 등록 시 사용되며, 모든 필드를 빈 상태로 초기화.
     */
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

    /**
     * 서버로부터 레시피 데이터를 가져오는 함수
     * 레시피 ID를 받아 해당 레시피의 상세 정보를 서버에서 가져오고 폼에 채움.
     * @param {number} id - 레시피 ID
     */
    const getRecipeById = async (id) => {
        try {
            const response = await axios.get(`/api/recipes/${id}`);
            setSelectedRecipe(response.data);

            // 응답 데이터를 폼 필드에 채움
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

    /**
     * 이미지 파일 선택 시 파일을 읽고 미리보기 URL을 생성
     * @param {Event} event - 파일 선택 이벤트
     */
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

    /**
     * 폼 제출 핸들러
     * 레시피 등록 또는 수정을 처리하며, 서버에 데이터를 전송.
     * 레시피 등록 후 포인트 지급 처리도 포함.
     * @param {Event} event - 폼 제출 이벤트
     */
    const handleSubmit = async (event) => {
        event.preventDefault(); // 기본 폼 제출 동작 방지

        // 필수 필드가 모두 채워졌는지 확인
        if (!title || !cookTime || !calories || !ingredients || !instructions || !tags || !category) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        if (!isEditing && !imageFile) {  // 등록 시 이미지 파일이 없는 경우
            alert('레시피 이미지를 업로드해주세요.');
            return;
        }

        // 폼 데이터를 FormData 객체로 구성 (이미지와 텍스트 데이터 포함)
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

        // 서버로 전송할 formData 내용 출력 (디버깅용)
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        try {
            if (isEditing) {
                await axios.put(`/api/recipes/${recipeIdx}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                alert('레시피가 성공적으로 수정되었습니다.');
                navigate(`/recipe/${recipeIdx}`);  // 수정 후 레시피 상세 페이지로 이동
                localStorage.removeItem('recommendedRecipes');  // 캐시된 추천 레시피 제거
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


                localStorage.removeItem('recommendedRecipes');  // 캐시된 추천 레시피 제거
                navigate(`/recipe`); // 등록 후 레시피 목록 페이지로 이동
                clearRecipeLocalStorage(); // 로컬 스토리지 초기화
                window.location.reload(); // 새로고침

            }
        } catch (error) {
            console.error('레시피 등록/수정 실패:', error);
            alert('레시피 등록/수정에 실패했습니다.');
        }
    };

    return (
        <div className="recipe-form-container">
            <PageHeader title={isEditing ? '레시피 수정' : '레시피 등록'} /> {/* 페이지 헤더 */}
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} id="recipe-form">  {/* 레시피 폼 */}
                <div className="form-field">
                    <div className="recipe-header-img"> {/* 이미지 업로드 필드 */}
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
