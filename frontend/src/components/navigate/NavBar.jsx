import React from 'react';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faCircleUser, faMap, faUserGroup, faUtensils} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import '../../assets/style/components/NavBar.css'
import { clearRecipeLocalStorage } from '../../utils/localStorageUtils';


function NavBar() {
    const navigate = useNavigate();

    const handleLinkClick = (path) => {
        clearRecipeLocalStorage();
        navigate(path);
    };

    return (
        <nav className="navBar">
            <Link to="/recipe" className="navBarLink" onClick={() => handleLinkClick('/recipe')}>
                <FontAwesomeIcon icon={faBook} />
                <p className="navBarTitle">레시피</p>
            </Link>
            <Link to="/recommend" className="navBarLink" onClick={() => handleLinkClick('/recommend')}>
                <FontAwesomeIcon icon={faUtensils} />
                <p className="navBarTitle">맛집추천</p>
            </Link>
            <Link to="/around" className="navBarLink" onClick={() => handleLinkClick('/around')}>
                <FontAwesomeIcon icon={faMap} />
                <p className="navBarTitle">주변맛집</p>
            </Link>
            <Link to="/group" className="navBarLink" onClick={() => handleLinkClick('/group')}>
                <FontAwesomeIcon icon={faUserGroup} />
                <p className="navBarTitle">함께먹기</p>
            </Link>
            <Link to="/myPage" className="navBarLink" onClick={() => handleLinkClick('/myPage')}>
                <FontAwesomeIcon icon={faCircleUser} />
                <p className="navBarTitle">내 정보</p>
            </Link>
        </nav>
    );
}

export default NavBar;