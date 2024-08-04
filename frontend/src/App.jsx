import React from 'react';
import MainRouter from './router/MainRouter';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminRouter from "./router/AdminRouter";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/admin/*" element={<AdminRouter />} />
                    <Route path="/*" element={
                        <Layout>
                            <MainRouter />
                        </Layout>
                    } />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
