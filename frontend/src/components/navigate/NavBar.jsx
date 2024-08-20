import React from 'react';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faCircleUser, faMap, faUserGroup, faUtensils} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";  // 페이지 이동과 링크 처리
import '../../assets/style/components/NavBar.css'
import { clearRecipeLocalStorage } from '../../utils/localStorageUtils'; // 로컬 스토리지에서 레시피 데이터를 초기화하는 유틸리티 함수

/**
 * NavBar 컴포넌트
 * 페이지 하단에 고정된 내비게이션 바로, 다양한 페이지로 이동할 수 있는 링크들을 포함합니다.
 *
 * @returns {JSX.Element} - 내비게이션 바 구성 요소
 */
function NavBar() {
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동을 처리

    /**
     * 링크 클릭 시 호출되는 함수
     * 로컬 스토리지를 초기화한 후 해당 경로로 이동합니다.
     *
     * @param {string} path - 이동할 경로
     */
    const handleLinkClick = (path) => {
        clearRecipeLocalStorage(); // 로컬 스토리지 초기화
        navigate(path); // 지정된 경로로 이동
    };

    return (
        <nav className="navBar">

            {/* 레시피 페이지로 이동하는 링크 */}
            <Link to="/recipe" className="navBarLink" onClick={() => handleLinkClick('/recipe')}>
                <FontAwesomeIcon icon={faBook} />
                <p className="navBarTitle">레시피</p>
            </Link>

            {/* 맛집추천 페이지로 이동하는 링크 */}
            <Link to="/recommend" className="navBarLink" onClick={() => handleLinkClick('/recommend')}>
                <FontAwesomeIcon icon={faUtensils} />
                <p className="navBarTitle">맛집추천</p>
            </Link>

            {/* 주변맛집 페이지로 이동하는 링크 */}
            <Link to="/around" className="navBarLink" onClick={() => handleLinkClick('/around')}>
                <FontAwesomeIcon icon={faMap} />
                <p className="navBarTitle">주변맛집</p>
            </Link>

            {/* 함께먹기 페이지로 이동하는 링크 */}
            <Link to="/group" className="navBarLink" onClick={() => handleLinkClick('/group')}>
                <FontAwesomeIcon icon={faUserGroup} />
                <p className="navBarTitle">함께먹기</p>
            </Link>

            {/* 내 정보 페이지로 이동하는 링크 */}
            <Link to="/myPage" className="navBarLink" onClick={() => handleLinkClick('/myPage')}>
                <FontAwesomeIcon icon={faCircleUser} />
                <p className="navBarTitle">내 정보</p>
            </Link>
        </nav>
    );
}

export default NavBar;