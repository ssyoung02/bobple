import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faChevronRight, faChevronLeft, faLocationDot, faBookmark, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import MainFoodBanner_jeon from "../../assets/images/banner/MainFoodBanner_jeon.jpg"
import trophy from "../../assets/images/gameimg/trophy.png";

    // 배너 이미지
    export const MainFoodBanner = () => {
        return (<img src={MainFoodBanner_jeon} alt={"전"}/>);
    }

    //게임 이미지
    export const Trophy = () => {
        return (<img src={trophy} alt={"월드컵"}/>);
    }

    //FontAwesomeIcon
    export const SearchIcon = () => {
        return (<FontAwesomeIcon icon={faMagnifyingGlass} />);
    }

    export const NextTo = () => {
        return (<FontAwesomeIcon icon={faChevronRight} />);
    }

    export const PrevTo = () => {
        return (<FontAwesomeIcon icon={faChevronLeft} />);
    }

    export const LocationDot = () => {
        return(<FontAwesomeIcon icon={faLocationDot} />);
    }

    export const FillBookmark = () => {
        return(<FontAwesomeIcon icon={faBookmark} />);
    }
    export const Bookmark = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 384 512">
                <path
                    d="M0 48C0 21.5 21.5 0 48 0l0 48 0 393.4 130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4 336 48 48 48 48 0 336 0c26.5 0 48 21.5 48 48l0 440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488L0 48z"/>
            </svg>
        );
    }

    export const CaretRight = () => {
        return(<FontAwesomeIcon icon={faCaretRight} />);
    }
