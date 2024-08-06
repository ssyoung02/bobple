import React from 'react';
import { Route, Routes } from "react-router-dom";
import MyPageMain from "../pages/myPage/MyPageMain";
import Calculator from "../pages/myPage/Calculator";
import LikeRecipe from "../pages/myPage/LikeRecipe";
import MyRecipe from "../pages/myPage/MyRecipe";
import BookMark from "../pages/myPage/BookMark"
import MyPointUsage from "../pages/myPage/MyPointUsage";
import UserModify from "../pages/myPage/UserModify";
import Login from "../pages/myPage/login/Login";

import UserFAQ from "../pages/myPage/serviceCenter/UserFAQ";
import UserNotice from "../pages/myPage/serviceCenter/UserNotice";
import UserQnA from "../pages/myPage/serviceCenter/UserQnA";
import UserQnAList from "../pages/myPage/serviceCenter/UserQnAList";
import UserNoticeDetail from "../pages/myPage/serviceCenter/UserNoticeDetail";
import KakaoLoginHandler from "../pages/myPage/login/KakaoLoginHandler";
import GoogleLoginHandler from "../pages/myPage/login/GoogleLoginHandler";
import NaverLoginHandler from "../pages/myPage/login/NaverLoginHandler";
import AdminLogin from "../pages/myPage/login/AdminLogin";

function MyPageRouter(){
        return(
            <Routes>
                    <Route path="/" element={<MyPageMain/>}/>
                    <Route path="/calculator" element={<Calculator/>}/>
                    <Route path="/likeRecipe" element={<LikeRecipe/>}/>
                    <Route path="/myRecipe" element={<MyRecipe/>}/>
                    <Route path="/bookmark" element={<BookMark/>}/>
                    <Route path="/myPointUseage" element={<MyPointUsage/>}/>
                    <Route path="/userModify" element={<UserModify/>}/>

                    <Route path="/login" element={<Login/>}/>
                    <Route path="/login/oauth2/callback/kakao" element={<KakaoLoginHandler/>} />
                    <Route path="/login/oauth2/callback/google" element={<GoogleLoginHandler/>} />
                    <Route path="/login/oauth2/callback/naver" element={<NaverLoginHandler/>} />
                   <Route path="/login/admin" element={<AdminLogin/>}/>


                <Route path="/serviceCenter/userFAQ" element={<UserFAQ/>}/>
                <Route path="/serviceCenter/userNotice" element={<UserNotice/>}/>
                <Route path="/serviceCenter/userQnA" element={<UserQnA/>}/>
                <Route path="/serviceCenter/userQnAList" element={<UserQnAList/>}/>
                <Route path="/serviceCenter/userNoticeDetail/:noticeidx" element={<UserNoticeDetail />} />
            </Routes>
    );
}

export default MyPageRouter;