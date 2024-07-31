import React from "react";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faArrowRightLong} from "@fortawesome/free-solid-svg-icons";
import '../../assets/style/recipe/RecipeMain.css';
import MainFoodBanner_jeon from "../../assets/images/MainFoodBanner_jeon.jpg";

function RecipeMain() {

    const navigate = useNavigate();

    const moveRecipeDetail = () => {
        navigate('/recipe/recipeDetail');
    }

    return (
            <div className={"RecipeMain"}>
                <div className="SearchInput">
                    <input
                        className="RecipeSaerchBox"
                        type="text"
                        placeholder="검색 키워드를 입력해주세요"
                    />
                    <button className="RecipeSearchButton">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
                <button className={"AIRecipe"}>
                    <div className={"AIRecipeTitle"}>
                        <p>지금 냉장고에 있는 재료로 뭐 만들어 먹지?</p>
                        <h2>AI 레시피 추천</h2>
                    </div>
                    <FontAwesomeIcon icon={faArrowRightLong} />
                </button>
                <div className={"LunchBoxTag"}>
                    <h2>도시락 레시피 추천</h2>
                    <div className={"LunchBoxTagList"}>
                        <div className={"LunchBoxTagItem"}>
                            <img src={MainFoodBanner_jeon} alt={"한식"}/>
                            <p>#한식</p>
                        </div>
                        <div className={"LunchBoxTagItem"}>
                            <img src={MainFoodBanner_jeon} alt={"한식"}/>
                            <p>#한식</p>
                        </div>
                        <div className={"LunchBoxTagItem"}>
                            <img src={MainFoodBanner_jeon} alt={"한식"}/>
                            <p>#한식</p>
                        </div>
                        <div className={"LunchBoxTagItem"}>
                            <img src={MainFoodBanner_jeon} alt={"한식"}/>
                            <p>#한식</p>
                        </div>
                    </div>
                </div>
                <div className={"UserRecommendRecipe"}>
                    <div className={"UserRecommendRecipeTitle"}>
                        <h2>유저 추천 레시피</h2>

                    </div>

                </div>
            </div>
    );
}


export default RecipeMain;

