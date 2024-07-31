import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import './App.css';
import MainPage from "./components/MainPage";
import Login from "./components/Login";
import RecipeMain from "./components/Recipe/RecipeMain";
import RecommendMain from "./components/RecommendFood/RecommendMain";
import AroundMain from "./components/AroundFood/AroundMain";
import GroupMain from "./components/EatingGroup/GroupMain";
import PointMain from "./components/PointShop/PointMain";
import MyPageMain from "./components/MyPage/MyPageMain";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/recipe" element={<RecipeMain/>}/>
                <Route path="/recommend" element={<RecommendMain/>}/>
                <Route path="/around" element={<AroundMain/>}/>
                <Route path="/group" element={<GroupMain/>}/>
                <Route path="/myinfo" element={<MyPageMain/>}/>
                <Route path="/point" element={<PointMain/>}/>
            </Routes>
        </Router>
    );
}

export default App;
