import React from 'react';
import {Route, Routes} from "react-router-dom";
import Notice from "../pages/admin/Notice";
import NoticeContext from "../pages/admin/NoticeContext";
import NoticeModify from "../pages/admin/NoticeModify";
import QnADetail from "../pages/admin/QnADetail";
import QnAList from "../pages/admin/QnAList";
import RecipeBoard from "../pages/admin/RecipeBoard";
import UserInfo from "../pages/admin/UserInfo";

function AdminRouter(){
    return(
        <Routes>
            <Route path="/admin/recipeBoard" element={<RecipeBoard/>}/>
            <Route path="/admin/notice" element={<Notice/>}/>
            <Route path="/admin/noticeContext" element={<NoticeContext/>}/>
            <Route path="/admin/noticeModify" element={<NoticeModify/>}/>
            <Route path="/admin/qnADetail" element={<QnADetail/>}/>
            <Route path="/admin/qnAList" element={<QnAList/>}/>
            <Route path="/admin" element={<UserInfo/>}/>
        </Routes>
    );
}

export default AdminRouter;