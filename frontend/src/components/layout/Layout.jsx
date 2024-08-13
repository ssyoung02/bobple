import React from 'react';
import '../../assets/style/components/Layout.css'
import Header from "../navigate/Header";
import NavBar from "../navigate/NavBar";

function Layout({ children, theme, toggleTheme }) {
    return (
        <div className={`App ${theme}`}>
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main>
                {children}
            </main>
            <NavBar />
        </div>
    );
}

export default Layout;