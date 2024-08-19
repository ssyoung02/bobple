import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faChevronRight, faChevronLeft, faLocationDot,
    faBookmark, faCaretRight, faArrowLeftLong, faArrowRightLong, faRotateLeft, faReceipt,
    faPen, faUser, faCalculator, faFilePen, faHeart, faQuestion,
    faExclamation, faVolumeOff, faLocationCrosshairs, faAngleDown, faAngleUp,
    faX, faBars, faEye, faXmark, faCamera, faImage, faFire, faCalendar,
    faClock, faEllipsisVertical, faHouse, faPhone, faMap, faStar} from "@fortawesome/free-solid-svg-icons";
import MainFoodBanner_jeon from "../../assets/images/banner/MainFoodBanner_jeon.jpg";
import calculator from  "../../assets/images/banner/main-01.calculator.png"
import aiLunch from  "../../assets/images/banner/main-02.AI-lunchbox.png"
import meeting from  "../../assets/images/banner/main-03.meeting.png"
import randomMenu from  "../../assets/images/banner/main-04.random-menu.png"

import trophy from "../../assets/images/gameimg/trophy.png";
import sendMessage from '../../assets/images/sendMessage.png';
import pointgameCacha from '../../assets/images/gameimg/point-game-01.gacha.png';
import pointgameFoodMatching from '../../assets/images/gameimg/point-game-02.foodmatching.png';
import pointgameAvoid from '../../assets/images/gameimg/point-game-03. avoidfood.png';
import pointgameSlot from '../../assets/images/gameimg/point-game-04. slotmachine.png';

import receiptSettlementImg from "../../assets/images/gameimg/receipt_ settlement.png";
import thinking_about from "../../assets/images/gameimg/thinking_about.png";
import gLogin from "../../assets/images/icon/google.png"
import nLogin from "../../assets/images/icon/naver.png"
import kLogin from  "../../assets/images/icon/kakao.png"





// 배너 이미지
export const MainFoodBanner = () => {
    return (<img src={MainFoodBanner_jeon} alt={"전"} />);
}

export const CalculatorBanner = () => {
    return (<img src={calculator} alt={"1/n 계산기"} />);
}

export const AiLunch = () => {
    return (<img src={aiLunch} alt={"AI 도시락"} />);
}

export const Meeting = () => {
    return (<img src={meeting} alt={"번개모임"} />);
}

export const RandomMenu = () => {
    return (<img src={randomMenu} alt={"랜덤메뉴"} />);
}


//로그인 이미지

export const Google = () => {
    return (<img src={gLogin} alt={"구글 로그인"} />);
}

export const NLogin = () => {
    return (<img src={nLogin} alt={"네이버 로그인"} />);
}

export const KLogin = () => {
    return (<img src={kLogin} alt={"카카오 로그인"} />);
}

// 게임 이미지
export const Trophy = () => {
    return (<img src={trophy} alt={"월드컵"} className="trophy-image"/>);
}

export const ReceiptSettlement = () => {
    return (<img src={receiptSettlementImg} alt={""} />); // 변경된 이름 사용
}

export const ThinkingAbout = () => {
    return (<img src={thinking_about} alt={""} />); // 변경된 이름 사용
}

export const SendMessage = () => {
    return (<img src={sendMessage} alt={""} />);
}

export const PointGameGacha = () => {
    return (<img src={pointgameCacha} alt={"Gacha"} />);
}

export const PointgameFoodMatching = () => {
    return (<img src={pointgameFoodMatching} alt={"Food Matching"} />);
}

export const PointgameAvoid = () => {
    return (<img src={pointgameAvoid} alt={"Avoid Food"} />);
}

export const PointgameSlot = () => {
    return (<img src={pointgameSlot} alt={"Slot machine"} />);
}




// FontAwesomeIcon
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
    return (<FontAwesomeIcon icon={faLocationDot} />);
}

export const FillBookmark = () => {
    return (<FontAwesomeIcon icon={faBookmark} />);
}


export const Bookmark = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M0 48C0 21.5 21.5 0 48 0l0 48 0 393.4 130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4 336 48 48 48 48 0 336 0c26.5 0 48 21.5 48 48l0 440c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488L0 48z" />
        </svg>
    );
}

export const CaretRight = () => {
    return (<FontAwesomeIcon icon={faCaretRight} />);
}

export const ArrowLeftLong = () => {
    return (<FontAwesomeIcon icon={faArrowLeftLong} />);
}

export const ArrowRightLong = () => {
    return (<FontAwesomeIcon icon={faArrowRightLong} />);
}

export const RotateLeft = () => {
    return (<FontAwesomeIcon icon={faRotateLeft} />);
}

export const Recipt = () => {
    return (<FontAwesomeIcon icon={faReceipt} />);
}

export const ModifyPen = () => {
    return (<FontAwesomeIcon icon={faPen} />);
}

export const DefaultUser = () => {
    return (<FontAwesomeIcon icon={faUser} />);
}

export const Calculator = () => {
    return (<FontAwesomeIcon icon={faCalculator} />);
}

export const FilePen = () => {
    return (<FontAwesomeIcon icon={faFilePen} />);
}

export const Heart = () => {
    return (<FontAwesomeIcon icon={faHeart} />);
}

export const HeartLine = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 512 512">
            <path
                d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8l0-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5l0 3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20-.1-.1s0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5l0 3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2l0-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
        </svg>
    );
}

export const HartFill = () => {
    return (<FontAwesomeIcon icon={faHeart}/>);
}


export const Notice = () => {
    return (<FontAwesomeIcon icon={faVolumeOff}/>);
}

export const Question = () => {
    return (<FontAwesomeIcon icon={faQuestion}/>);
}

export const Exclamation = () => {
    return (<FontAwesomeIcon icon={faExclamation}/>);
}

export const LocationTarget = () => {
    return (<FontAwesomeIcon icon={faLocationCrosshairs}/>);
}

export const Down = () => {
    return (<FontAwesomeIcon icon={faAngleDown}/>);
}

export const Up = () => {
    return (<FontAwesomeIcon icon={faAngleUp} />);
}

export const LargeX = () => {
    return (<FontAwesomeIcon icon={faX}/>);
}

export const Menu = () => {
    return (<FontAwesomeIcon icon={faBars}/>);
}

export const View = () => {
    return (<FontAwesomeIcon icon={faEye}/>);
}

export const CloseIcon = () => {
    return (<FontAwesomeIcon icon={faXmark} />);
}

export const Camera = () => {
    return (<FontAwesomeIcon icon={faCamera} />);
}

export const ImageIcon = () => {
    return (<FontAwesomeIcon icon={faImage} />);
}

export const Clock = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
                d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/>
        </svg>
    );
}

export const FireIcon = () => {
    return (<FontAwesomeIcon icon={faFire} />);
}

export const Calendar = () => {
    return (<FontAwesomeIcon icon={faCalendar} />);
}

export const ClockIcon = () => {
    return (<FontAwesomeIcon icon={faClock} />);
}

export const MoreIcon = () => {
    return (<FontAwesomeIcon icon={faEllipsisVertical} />);
}

export const Comment = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 512 512">
            <path
                d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9l.3-.5z"/>
        </svg>);
}

export const Home = () => {
    return (<FontAwesomeIcon icon={faHouse} />);
}

export const Phone = () => {
    return (<FontAwesomeIcon icon={faPhone} />);
}

export const LocationMap = () => {
    return (<FontAwesomeIcon icon={faMap} />);
}

export const StarFill = () => {
    return (<FontAwesomeIcon icon={faStar} />)
}

export const StarLine =() => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 576 512">
            <path
                d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/>
        </svg>
    )
}