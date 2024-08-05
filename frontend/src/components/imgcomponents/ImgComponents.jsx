import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faChevronRight, faChevronLeft, faLocationDot,
    faBookmark, faCaretRight, faArrowLeftLong, faRotateLeft, faReceipt,
    faPen, faUser, faCalculator, faFilePen, faHeart, faQuestion,
    faExclamation, faVolumeOff, faLocationCrosshairs, faAngleDown, faAngleUp,
    faX} from "@fortawesome/free-solid-svg-icons";
import MainFoodBanner_jeon from "../../assets/images/banner/MainFoodBanner_jeon.jpg";
import trophy from "../../assets/images/gameimg/trophy.png";
import receiptSettlementImg from "../../assets/images/gameimg/receipt_ settlement.png";
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
    return (<img src={trophy} alt={"월드컵"} />);
}

export const ReceiptSettlement = () => {
    return (<img src={receiptSettlementImg} alt={""} />); // 변경된 이름 사용
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

export const Hart = () => {
    return (<FontAwesomeIcon icon={faHeart} />);
}

export const Notice = () => {
    return (<FontAwesomeIcon icon={faVolumeOff} />);
}

export const Question = () => {
    return (<FontAwesomeIcon icon={faQuestion} />);
}

export const Exclamation = () => {
    return (<FontAwesomeIcon icon={faExclamation} />);
}

export const LocationTarget = () => {
    return (<FontAwesomeIcon icon={faLocationCrosshairs} />);
}

export const Down = () => {
    return (<FontAwesomeIcon icon={faAngleDown} />);
}

export const Up = () => {
    return (<FontAwesomeIcon icon={faAngleUp} />);
}

export const LargeX = () => {
    return (<FontAwesomeIcon icon={faX} />);
}