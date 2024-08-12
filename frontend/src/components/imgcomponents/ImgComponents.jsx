import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faChevronRight, faChevronLeft, faLocationDot,
    faBookmark, faCaretRight, faArrowLeftLong, faArrowRightLong, faRotateLeft, faReceipt,
    faPen, faUser, faCalculator, faFilePen, faHeart, faQuestion,
    faExclamation, faVolumeOff, faLocationCrosshairs, faAngleDown, faAngleUp,
    faX, faBars, faEye, faXmark, faCamera, faImage, faFire} from "@fortawesome/free-solid-svg-icons";
import MainFoodBanner_jeon from "../../assets/images/banner/MainFoodBanner_jeon.jpg";
import trophy from "../../assets/images/gameimg/trophy.png";
import sendMessage from '../../assets/images/sendMessage.png';
import receiptSettlementImg from "../../assets/images/gameimg/receipt_ settlement.png";
import thinking_about from "../../assets/images/gameimg/thinking_about.png";
import gLogin from "../../assets/images/icon/google.png"
import nLogin from "../../assets/images/icon/naver.png"
import kLogin from  "../../assets/images/icon/kakao.png"

// 배너 이미지
export const MainFoodBanner = () => {
    return (<img src={MainFoodBanner_jeon} alt={"전"} />);
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