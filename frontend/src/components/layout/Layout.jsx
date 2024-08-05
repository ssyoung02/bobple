import React from 'react';
import '../../assets/style/components/Layout.css'
import Header from "../navigate/Header";
import NavBar from "../navigate/NavBar";

function Layout({ children }) {
    return (
        <div className="App">
            <Header />
            <main>
                {children}
            </main>
            <NavBar />
        </div>
    );
}

export default Layout;