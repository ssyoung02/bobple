import React from 'react';
import '../../assets/style/admin/NoticeModify.css'

function NoticeModify({notice}) {
    if (!notice) return null;

    return (
        <div className="user-detail-container-n">
            <div className="user-detail-header">
                <h4><span>No.{notice.noticeIdx}</span> {notice.noticeTitle}</h4>
                <p>{new Date(notice.createdAt).toLocaleDateString()}</p>
            </div>
            <hr className="hr-style"/>
            <div className="user-detail-n">
                <p>{notice.noticeDescription}</p>
            </div>
        </div>
    );
}

export default NoticeModify;