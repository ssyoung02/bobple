import React from 'react';
import {Route, Routes} from "react-router-dom";
import MyPageMain from "../pages/myPage/MyPageMain";
import Calculator from "../pages/myPage/Calculator";
import LikeRecipe from "../pages/myPage/LikeRecipe";
import MyRecipe from "../pages/myPage/MyRecipe";
import MyPointUsage from "../pages/myPage/MyPointUsage";
import UserModify from "../pages/myPage/UserModify";
import Login from "../pages/myPage/login/Login";

import UserFAQ from "../pages/myPage/serviceCenter/UserFAQ";
import UserNotice from "../pages/myPage/serviceCenter/UserNotice";
import UserQnA from "../pages/myPage/serviceCenter/UserQnA";
import UserQnAList from "../pages/myPage/serviceCenter/UserQnAList";
import UserNoticeDetail from "../pages/myPage/serviceCenter/UserNoticeDetail";

function MyPageRouter(){
    return(
        <Routes>
            <Route path="/myPage" element={<MyPageMain/>}/>
            <Route path="/myPage/calculator" element={<Calculator/>}/>
            <Route path="/myPage/likeRecipe" element={<LikeRecipe/>}/>
            <Route path="/myPage/myRecipe" element={<MyRecipe/>}/>
            <Route path="/myPage/myPointUseage" element={<MyPointUsage/>}/>
            <Route path="/myPage/userModify" element={<UserModify/>}/>

            <Route path="/myPage/login/login" element={<Login/>}/>

            <Route path="/myPage/serviceCenter/userFAQ" element={<UserFAQ/>}/>
            <Route path="/myPage/serviceCenter/userNotice" element={<UserNotice/>}/>
            <Route path="/myPage/serviceCenter/userQnA" element={<UserQnA/>}/>
            <Route path="/myPage/serviceCenter/userQnAList" element={<UserQnAList/>}/>
            <Route path="/myPage/serviceCenter/userNoticeDetail" element={<UserNoticeDetail/>}/>
        </Routes>
    );
}

export default MyPageRouter;