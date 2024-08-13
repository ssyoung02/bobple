import React from 'react';
import '../../assets/style/components/Header.css';
import { faCartShopping, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import logoImg from "../../assets/images/bobple_logo.png";
import { clearRecipeLocalStorage } from '../../utils/localStorageUtils';


function Header({ theme, toggleTheme }) {
    const navigate = useNavigate();

    const moveSearch = () => {
        clearRecipeLocalStorage();
        navigate('/search');
    };

    const handleLinkClick = (path) => {
        clearRecipeLocalStorage();
        navigate(path);
    };

    return (
        <div className="header">
            <Link to="/" className="headerLogo" onClick={() => handleLinkClick('/')}> {/* onClick 추가 */}
                <img src={logoImg} alt="bobple로고" />
            </Link>
            <div className="headerButton">
                <label className="theme-checkbox-label">
                    <input type="checkbox" className="theme-checkbox" onClick={toggleTheme} />
                    <span className="theme-slider"></span>
                </label>
                <Link to="/point" className="headerLink" onClick={() => handleLinkClick('/point')}> {/* onClick 추가 */}
                    <FontAwesomeIcon icon={faCartShopping} />
                </Link>
                <button type={"button"} className={"headerLink"} onClick={moveSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                </button>
            </div>
        </div>
    );
}

export default Header;
