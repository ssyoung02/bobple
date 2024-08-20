// src/components/Recipe/LatestRecipeCard.jsx
import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import mascot from "../../assets/images/bobple_mascot.png"; // CSS 파일 import
import {Calendar, DefaultUser, View} from "../../components/imgcomponents/ImgComponents";
import dayjs from "dayjs"; // 날짜 포맷팅 라이브러리
import RecipeContext from "./RecipeContext"; // 레시피 관련 상태 관리

/**
 * 최신 레시피 카드 컴포넌트
 * 최신 레시피 목록을 카드 형태로 렌더링하는 컴포넌트로, 레시피 이미지, 제목, 작성자, 날짜, 조회수 등을 표시한다.
 * 이미지가 없거나 오류가 있을 경우 기본 이미지로 대체된다.
 * @param {Object} recipe - 각 레시피 정보 객체 (recipeIdx, title, nickname, createdAt, viewsCount 등)
 * @returns {JSX.Element} 최신 레시피 카드 UI
 */
function LatestRecipeCard({ recipe }) {
    const { formatViewsCount } = useContext(RecipeContext); // 조회수 포맷팅 함수

    return (
        <div className="latest-recipe-card"> {/* 레시피 카드 전체 래퍼 */}
            <Link to={`/recipe/${recipe.recipeIdx}`}> {/* 클릭 시 해당 레시피 상세 페이지로 이동 */}
                <div className="recipe-card-image">
                    <img src={recipe.picture || '/images/default_recipe_image.jpg'} alt={recipe.title} onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = mascot;
                    }}/>
                </div>
                <div className="recipe-card-content"> {/* 레시피 정보 섹션 */}
                    <h5>{recipe.title}</h5>
                    <p className="recipe-writer"><DefaultUser /> {recipe.nickname} | <Calendar /> {dayjs(recipe.createdAt).format('YYYY-MM-DD')} | <View/> {formatViewsCount(recipe.viewsCount)}</p>
                    <p className="description">{recipe.content}</p>
                </div>
            </Link>
        </div>
    );
}

export default LatestRecipeCard;
