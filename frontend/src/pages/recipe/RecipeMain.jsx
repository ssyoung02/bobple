import React from "react";
import {useNavigate} from "react-router-dom";
import '../../assets/style/MainPage.css'
import Modal from "../../components/modal/Modal";

function RecipeMain() {
    const navigate = useNavigate();

    const moveRecipeDetail = () => {
        navigate('/recipe/recipeDetail');
    }

    return (
        <div>
            안녕하세요!
            <Modal/>
            <button className="recipe-button footer-btn" onClick={moveRecipeDetail}>레시피상세</button>
        </div>
    )
}

export default RecipeMain;