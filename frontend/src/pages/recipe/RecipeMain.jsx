import React from "react";
import {useNavigate} from "react-router-dom";

function RecipeMain() {

    const navigate = useNavigate();

    const moveRecipeDetail = () => {
        navigate('/recipe/recipeDetail');
    }

    return (
            <div>
                안녕하세요!
                <button onClick={moveRecipeDetail}>레시피 상세</button>
            </div>
    );
}


export default RecipeMain;

