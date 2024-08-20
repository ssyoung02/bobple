// src/utils/localStorageUtils.js

/**
 * clearRecipeLocalStorage 함수
 * 로컬 스토리지에서 레시피 관련 데이터를 삭제하는 함수입니다.
 * 레시피 페이지, 최신 레시피, 마지막으로 로드된 키 데이터를 제거합니다.
 */
export const clearRecipeLocalStorage = () => {
    localStorage.removeItem('recipePage'); // 레시피 페이지 데이터를 로컬 스토리지에서 제거
    localStorage.removeItem('latestRecipes');  // 최신 레시피 데이터를 로컬 스토리지에서 제거
    localStorage.removeItem('lastLoadedKey');  // 마지막으로 로드된 키 데이터를 로컬 스토리지에서 제거
};