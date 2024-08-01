import React from 'react';
import MainRouter from './router/MainRouter';
import './App.css';
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <div className="App">
                    <MainRouter />
                </div>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
