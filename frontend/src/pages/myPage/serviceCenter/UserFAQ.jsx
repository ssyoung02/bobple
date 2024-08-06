import React, {useState} from 'react';
import '../../../assets/style/myPage/serviceCenter/UserFAQ.css';
import { ArrowLeftLong, Down, Up } from "../../../components/imgcomponents/ImgComponents";
import {useNavigate} from "react-router-dom";

function UserFAQ() {
    const navigate = useNavigate();
    const [expandedQuestionIds, setExpandedQuestionIds] = useState([]);

    const questions = [
        {
            queIdx: 1,
            title: "포인트 이용 안내",
            date: "2024. 8. 5.",
            content: "기프티콘 이용 기한은 구매 후 1년 이내입니다"
        },
        {
            queIdx: 2,
            title: "BOBPLE 서비스 이용 안내",
            date: "2024. 8. 6.",
            content: "안녕하세요. 직장인들의 식사를 위한 BOBPLE 서비스입니다"
        },
    ];

    const moveMyPage = () => {
        navigate('/mypage')
    }

    const toggleExpand = (queIdx) => {
        setExpandedQuestionIds((prev) =>
            prev.includes(queIdx) ? prev.filter(id => id !== queIdx) : [...prev, queIdx]
        );
    };

    return (
        <div className="user-FAQ-main">
            <div className="user-FAQ-top">
                <button aria-label="내정보로 돌아가기" onClick={moveMyPage}>
                    <ArrowLeftLong />
                </button>
                <h3>자주 묻는 질문</h3>
            </div>
            <div className="faq-box">
                <ul>
                    {questions.map((question) => (
                        <li key={question.queIdx}>
                            <button className="faq-title" onClick={() => toggleExpand(question.queIdx)}>
                                <div className="faq-title-left">
                                    <h6>{question.title}</h6>
                                    <p className="qna-date">{question.date}</p>
                                </div>
                                {expandedQuestionIds.includes(question.queIdx) ? <Up /> : <Down />}
                            </button>
                            {expandedQuestionIds.includes(question.queIdx) && (
                                <div className="qna-content">
                                    <p>{question.content}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default UserFAQ;
