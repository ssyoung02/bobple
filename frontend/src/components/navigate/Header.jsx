import React from 'react';
import '../../assets/style/components/Header.css'
import {faCartShopping, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Link, useNavigate} from "react-router-dom";
import logoimg from "../../assets/images/bobple_logo.png"

function Header(){
    const navigate = useNavigate();

    const moveSearch = () => {
        navigate('/search');
    }

    return(
        <div className="header">
            <Link to={"/"} className={"headerLogo"}>
                <img src={logoimg} alt={"bobple로고"}/>
            </Link>
            <div className={"headerButton"}>
                <Link to={"/point"} className={"headerLink"}>
                    <FontAwesomeIcon icon={faCartShopping} />
                </Link>
                <button type={"button"} className={"headerLink"} onClick={moveSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </div>
    );
}

export default Header;