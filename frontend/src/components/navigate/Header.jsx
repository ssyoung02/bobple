import React from 'react';
import '../../assets/style/components/Header.css';
import { faCartShopping, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // 페이지 이동 및 링크 처리
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../assets/images/bobple_logo.png";
import { clearRecipeLocalStorage } from '../../utils/localStorageUtils'; // 로컬스토리지에서 레시피 데이터를 초기화하는 유틸리티 함수

/**
 * Header 컴포넌트
 * 사이트의 상단에 위치한 헤더로, 로고, 테마 전환, 포인트 페이지로의 이동, 검색 기능을 포함합니다.
 *
 * @param {Object} props - 컴포넌트의 프로퍼티
 * @param {string} props.theme - 현재 테마 (예: 'light' 또는 'dark')
 * @param {Function} props.toggleTheme - 테마를 전환하는 함수
 * @returns {JSX.Element} - 헤더 구성 요소
 */
function Header({ theme, toggleTheme }) {
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동을 처리

    /**
     * 검색 페이지로 이동하는 함수
     * 로컬 스토리지에 저장된 레시피 데이터를 초기화한 후 검색 페이지로 이동합니다.
     */
    const moveSearch = () => {
        clearRecipeLocalStorage(); // 로컬 스토리지 초기화
        navigate('/search'); // 검색 페이지로 이동
    };

    /**
     * 링크 클릭 시 호출되는 함수
     * 로컬 스토리지를 초기화한 후 해당 경로로 이동합니다.
     *
     * @param {string} path - 이동할 경로
     */
    const handleLinkClick = (path) => {
        clearRecipeLocalStorage(); // 로컬 스토리지 초기화
        navigate(path); // 해당 경로로 이동
    };

    return (
        <div className="header">

            {/* 로고 클릭 시 메인 페이지로 이동 */}
            <Link to="/" className="headerLogo" onClick={() => handleLinkClick('/')}>
                <img src={logoImg} alt="bobple로고" />
            </Link>
            <div className="headerButton">
                {/* 테마 전환 체크박스 */}
                <label className="theme-checkbox-label">
                    <input type="checkbox" className="theme-checkbox" onClick={toggleTheme} />
                    <span className="theme-slider"></span>
                </label>

                {/* 포인트 페이지로 이동하는 링크 */}
                <Link to="/point" className="headerLink" onClick={() => handleLinkClick('/point')}>
                    <FontAwesomeIcon icon={faCartShopping} />
                </Link>

                {/* 검색 페이지로 이동하는 버튼 */}
                <button type={"button"} className={"headerLink"} onClick={moveSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                </button>
            </div>
        </div>
    );
}

export default Header;
