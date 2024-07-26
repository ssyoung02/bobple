import React from 'react';
import Header from "../navigate/Header";
import NavBar from "../navigate/NavBar";

function Layout({ children }) {
    return (
        <>
            <Header />
            <main>
                {children}
            </main>
            <NavBar />
        </>
    );
}

export default Layout;