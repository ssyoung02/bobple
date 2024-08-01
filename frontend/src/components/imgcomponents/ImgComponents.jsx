import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faChevronRight, faChevronLeft} from "@fortawesome/free-solid-svg-icons";
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