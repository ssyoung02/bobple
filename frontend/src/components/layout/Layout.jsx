import React from 'react';
import '../../assets/style/components/Layout.css'
import Header from "../navigate/Header";
import NavBar from "../navigate/NavBar";

/**
 * Layout 컴포넌트
 * 페이지의 기본 레이아웃을 구성하는 컴포넌트로, 헤더, 메인 컨텐츠, 내비게이션 바를 포함합니다.
 *
 * @param {Object} props - 컴포넌트의 프로퍼티
 * @param {React.ReactNode} props.children - 레이아웃 안에 표시될 메인 컨텐츠
 * @param {string} props.theme - 현재 테마 (예: 'light' 또는 'dark')
 * @param {Function} props.toggleTheme - 테마를 전환하는 함수
 * @returns {JSX.Element} - 레이아웃 구성 요소
 */
function Layout({ children, theme, toggleTheme }) {
    return (
        <div className={`App ${theme}`}>
            {/* 헤더 컴포넌트, 테마와 테마 전환 함수 전달 */}
            <Header theme={theme} toggleTheme={toggleTheme} />

            {/* 메인 컨텐츠 영역 */}
            <main>
                {children}
            </main>

            {/* 내비게이션 바 컴포넌트 */}
            <NavBar />
        </div>
    );
}

export default Layout;