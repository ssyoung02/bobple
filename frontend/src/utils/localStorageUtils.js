// src/utils/localStorageUtils.js
export const clearRecipeLocalStorage = () => {
    localStorage.removeItem('recipePage');
    localStorage.removeItem('latestRecipes');
    localStorage.removeItem('lastLoadedKey');
};