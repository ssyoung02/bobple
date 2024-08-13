import React, {useEffect, useState} from 'react';
import MainRouter from './router/MainRouter';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AdminRouter from "./router/AdminRouter";

function App() {

    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        document.body.className = theme === 'light' ? 'light-mode' : 'dark-mode';
    }, [theme]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/admin/*" element={<AdminRouter />} />
                <Route path="/*" element={
                    <Layout theme={theme} toggleTheme={toggleTheme}>
                        <MainRouter />
                    </Layout>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
