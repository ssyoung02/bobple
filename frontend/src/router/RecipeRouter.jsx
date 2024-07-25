import React from 'react';
import {Route, Routes} from "react-router-dom";
import RecipeMain from "../pages/recipe/RecipeMain";
import RecipeDetail from "../pages/recipe/RecipeDetail";
import RecipeModify from "../pages/recipe/RecipeModify";
import RecipeAi from "../pages/recipe/RecipeAi";

function RecipeRouter(){
    return(
        <Routes>
            <Route path="/" element={<RecipeMain/>}/>
            <Route path="/recipeDetail" element={<RecipeDetail/>}/>
            <Route path="/recipeModify" element={<RecipeModify/>}/>
            <Route path="/recipeAi" element={<RecipeAi/>}/>
        </Routes>
    );
}

export default RecipeRouter;
