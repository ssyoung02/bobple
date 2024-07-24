import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import './App.css';
import MainPage from "./components/MainPage";
import Login from "./components/Login";
import RecipeMain from "./components/Recipe/RecipeMain";
import RecommendMain from "./components/RecommendFood/RecommendMain"
import AroundMain from "./components/AroundFood/AroundMain";
import GroupMain from "./components/EatingGroup/GroupMain";
import MyInfoMain from "./components/MyPage/MyInfoMain";
import PointMain from "./components/PointShop/PointMain"

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
                <Route path="/myinfo" element={<MyInfoMain/>}/>
                <Route path="/point" element={<PointMain/>}/>
            </Routes>
        </Router>
    );
}

export default App;
