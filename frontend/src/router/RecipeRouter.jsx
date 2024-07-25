import React from 'react';
import {Route, Routes} from "react-router-dom";
import RecipeMain from "../pages/recipe/RecipeMain";
import RecipeDetail from "../pages/recipe/RecipeDetail";
import RecipeModify from "../pages/recipe/RecipeModify";
import RecipeAi from "../pages/recipe/RecipeAi";

function RecipeRouter(){
    return(
        <Routes>
            <Route path="/recipe" element={<RecipeMain/>}/>
            <Route path="/recipe/recipeDetail" element={<RecipeDetail/>}/>
            <Route path="/recipe/recipeModify" element={<RecipeModify/>}/>
            <Route path="/recipe/recipeAi" element={<RecipeAi/>}/>
        </Routes>
    );
}

export default RecipeRouter;
