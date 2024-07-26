import React from 'react';
import '../../assets/style/components/Header.css'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBook, faCircleUser, faMap, faUserGroup, faUtensils} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import '../../assets/style/components/NavBar.css'

function NavBar(){
    return(
        <div className="navBar">
            <Link to={"/recipe"} className={"navBarLink"}>
                <FontAwesomeIcon icon={faBook} />
                <p className={"navBarTitle"}>레시피</p>
            </Link>
            <Link to={"/recommend"} className={"navBarLink"}>
                <FontAwesomeIcon icon={faUtensils} />
                <p className={"navBarTitle"}>맛집추천</p>
            </Link>
            <Link to={"/around"} className={"navBarLink"}>
                <FontAwesomeIcon icon={faMap} />
                <p className={"navBarTitle"}>주변맛집</p>
            </Link>
            <Link to={"/group"} className={"navBarLink"}>
                <FontAwesomeIcon icon={faUserGroup} />
                <p className={"navBarTitle"}>함께먹기</p>
            </Link>
            <Link to={"/myPage"} className={"navBarLink"}>
                <FontAwesomeIcon icon={faCircleUser} />
                <p className={"navBarTitle"}>내 정보</p>
            </Link>
        </div>
    );
}

export default NavBar;