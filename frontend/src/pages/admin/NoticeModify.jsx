import React from 'react';
import '../../assets/style/admin/NoticeModify.css'

function NoticeModify({notice}) {
    if (!notice) return null;

    return (
        <div className="user-detail-container-n">
            <h3>공지사항</h3>
            <hr className="hr-style"/>
            <div className="user-detail-n">
                <p><strong>작성자:</strong> {notice.author}</p>
                <p><strong>제목:</strong> {notice.title}</p>
                <p><strong>작성날짜:</strong> {notice.date}</p>
                <p><strong>본문내용:</strong> {notice.description}</p>
            </div>
        </div>
    );
}

export default NoticeModify;