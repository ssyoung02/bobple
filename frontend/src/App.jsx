import React from 'react';
import MainRouter from './router/MainRouter';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminRouter from "./router/AdminRouter";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin/*" element={<AdminRouter />} />
                <Route path="/*" element={
                    <Layout>
                        <MainRouter />
                    </Layout>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
