import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../assets/style/myPage/serviceCenter/UserNotice.css';
import { ArrowLeftLong } from "../../../components/imgcomponents/ImgComponents";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/layout/PageHeader";

function UserNotice() {
    const [noticelist, setNoticelist] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/notices');

                if (response.status === 200) {
                    setNoticelist(response.data);
                } else {
                    setError('공지사항을 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                setError('공지사항을 가져오는 데 실패했습니다.');
                console.error('공지사항 가져오기 오류:', error);
            }
        };

        fetchNotices();
    }, []);
    

    const moveNoticeDetail = (noticeidx) => {
        navigate(`/mypage/serviceCenter/userNoticeDetail/${noticeidx}`);
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="notice-main">
            <PageHeader title="공지사항" />
            <div>
                <ul>
                    {noticelist.map((notice) => (
                        <li key={notice.noticeIdx}>
                            <button className="faq-title" onClick={() => moveNoticeDetail(notice.noticeIdx)}>
                                <div className="faq-title-left">
                                    <h6>{notice.noticeTitle}</h6>
                                    <p className="qna-date">{new Date(notice.createdAt).toLocaleDateString()}</p>
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
