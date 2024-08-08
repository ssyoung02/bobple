import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../assets/style/myPage/serviceCenter/UserNotice.css';
import { ArrowLeftLong } from "../../../components/imgcomponents/ImgComponents";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/layout/PageHeader";

function UserNoticeDetail() {
    const { noticeidx } = useParams();
    const [notice, setNotice] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/notices/${noticeidx}`);

                if (response.status === 200) {
                    setNotice(response.data);
                } else {
                    setError('공지사항을 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                setError('공지사항을 가져오는 데 실패했습니다.');
                console.error('공지사항 가져오기 오류:', error);
            }
        };

        fetchNotice();
    }, [noticeidx]);


    if (error) {
        return <div>{error}</div>;
    }

    if (!notice) {
        return <div>Loading...</div>;
    }

    return (
        <div className="notice-main">
            <PageHeader title="공지사항 상세" />
            <div className="faq-title">
                <div className="faq-title-left">
                    <h6>{notice.noticeTitle}</h6>
                    <p className="qna-date">{new Date(notice.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="notice-content">
                <p>{notice.noticeDescription}</p>
            </div>
        </div>
    );
}

export default UserNoticeDetail;
