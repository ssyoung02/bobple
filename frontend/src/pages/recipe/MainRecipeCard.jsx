import React, {useContext, useState} from 'react';
import {Link} from 'react-router-dom';
import RecipeContext from '../../pages/recipe/RecipeContext';
import '../../assets/style/recipe/RecipeCard.css'; // 레시피 카드에 대한 스타일링을 적용한 CSS 파일
import { Heart, HeartLine} from "../../components/imgcomponents/ImgComponents"; // 좋아요 아이콘 컴포넌트 import
import mascot from "../../assets/images/bobple_mascot.png"; // 기본 이미지 import (이미지 로드 실패 시 사용)
import { formatViewsCount } from "../../utils/NumberFormatUtil.js";  // 조회수 포맷팅 유틸리티 함수 import

/**
 * RecipeCard 컴포넌트
 * 레시피 목록에 있는 각각의 레시피 카드를 보여주는 컴포넌트입니다. 좋아요 기능을 제공하며, 레시피의 간단한 정보를 표시합니다.
 * @param {Object} props - 레시피 데이터 객체를 전달받습니다.
 * @param {Object} props.recipe - 레시피 데이터 객체 (레시피 제목, 작성자, 조회수, 좋아요 정보 등)
 * @returns {JSX.Element} 레시피 카드 UI 렌더링
 */
function RecipeCard({ recipe }) {
    const { likeRecipe } = useContext(RecipeContext); // RecipeContext를 통해 좋아요 기능을 불러옴
    const [isLiked, setIsLiked] = useState(recipe.liked); // 좋아요 상태 관리 (초기값은 레시피 객체에서 가져옴)
    const [likesCount, setLikesCount] = useState(recipe.likesCount); // 좋아요 수 상태 관리

    /**
     * 좋아요 버튼 클릭 핸들러
     * 서버에 좋아요/좋아요 취소 요청을 보내고, 로컬 상태를 업데이트
     */
    const handleLikeClick = async () => {
        try {
            await likeRecipe(recipe.recipeIdx); // 좋아요 요청을 서버로 전송
            // 좋아요 상태 및 좋아요 수 업데이트
            setIsLiked(!isLiked);  // 현재 좋아요 상태를 반전시킴
            setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);  // 좋아요 수 업데이트

        } catch (error) {
            console.error('좋아요 처리 중 오류가 발생했습니다.', error); // 오류 발생 시 콘솔에 출력
        }
    };


    return (
        <div className="main-recipe-card">
            {/* 레시피 상세 페이지로 이동 */}
            <Link to={`/recipe/${recipe.recipeIdx}`}>
                <div className="recipe-card-image">
                    <img src={recipe.picture}
                         alt={recipe.title}
                         onError={(e) => { // 이미지 로드 실패 시 기본 이미지로 대체
                             e.target.onerror = null;
                             e.target.src = mascot;
                         }}
                    />
                </div>
            </Link>

            {/* 레시피 제목, 작성자, 조회수 및 간단한 설명을 표시 */}
            <Link to={`/recipe/${recipe.recipeIdx}`} className="main-recipe-card-title">
                <div>
                    <h5>{recipe.title}</h5>
                    <p className="author">작성자: {recipe.nickname} | 조회수: {formatViewsCount(recipe.viewsCount)} </p>
                    <p className="description">
                        {/* 레시피 내용이 길면 20자로 줄여서 표시 */}
                        {recipe.content.length > 50 ? recipe.content.slice(0, 20) + "..." : recipe.content}
                    </p>
                </div>
            </Link>

            {/* 레시피 카드 하단: 좋아요 버튼 및 좋아요 수 */}
            <div className="recipe-card-bottom">
                <div className="recipe-card-bottom-button">

                    {/* 좋아요 버튼 */}
                    <button className="recipe-like-button" onClick={handleLikeClick}>

                        {/* 좋아요 여부에 따라 다른 아이콘을 보여줌 */}
                        {isLiked ? <Heart/> : <HeartLine/>}
                    </button>

                    {/* 좋아요 수를 표시 */}
                    {likesCount}
                </div>
            </div>

        </div>

    );
}

export default RecipeCard;