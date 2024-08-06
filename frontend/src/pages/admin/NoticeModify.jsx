import React from 'react';
import '../../assets/style/admin/NoticeModify.css'

function NoticeModify({notice}) {
    if (!notice) return null;

    return (
        <div className="user-detail-container-n">
            <h3>공지사항</h3>
            <hr className="hr-style"/>
            <div className="user-detail-n">
                <p><strong>제목:</strong> {notice.noticeTitle}</p>
                <p><strong>작성날짜:</strong> {new Date(notice.createdAt).toLocaleDateString()}</p>
                <p><strong>본문내용:</strong> {notice.noticeDescription}</p>
            </div>
        </div>
    );
}

export default NoticeModify;