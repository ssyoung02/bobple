import React from 'react';
import '../../../assets/style/myPage/serviceCenter/UserNotice.css';
import { ArrowLeftLong } from "../../../components/imgcomponents/ImgComponents";
import { useNavigate } from "react-router-dom";

function UserNotice() {
    const navigate = useNavigate();

    const noticelist = [
        {
            noticeidx: 1,
            title: "[공지]포인트 이용 안내",
            date: "2024. 8. 5.",
            content: "기프티콘 이용 기한은 구매 후 1년 이내입니다"
        },
        {
            noticeidx: 2,
            title: "[공지]BOBPLE 서비스 이용 안내",
            date: "2024. 8. 6.",
            content: "안녕하세요. 직장인들의 식사를 위한 BOBPLE 서비스입니다"
        },
    ];

    const moveMyPage = () => {
        navigate('/mypage');
    }

    const moveNoticeDetail = (noticeidx) => {
        navigate(`/mypage/serviceCenter/userNoticeDetail/${noticeidx}`);
    }

    return (
        <div className="notice-main">
            <div className="notice-top">
                <button aria-label="내정보로 돌아가기" onClick={moveMyPage}>
                    <ArrowLeftLong />
                </button>
                <h3>공지사항</h3>
            </div>
            <div>
                <ul>
                    {noticelist.map((notice) => (
                        <li key={notice.noticeidx}>
                            <button className="faq-title" onClick={() => moveNoticeDetail(notice.noticeidx)}>
                                <div className="faq-title-left">
                                    <h6>{notice.title}</h6>
                                    <p className="qna-date">{notice.date}</p>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default UserNotice;
