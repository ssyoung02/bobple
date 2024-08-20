import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 hook
import { ArrowLeftLong } from "../imgcomponents/ImgComponents"; // 뒤로 가기 아이콘 컴포넌트
import '../../assets/style/components/PageHeader.css';

/**
 * PageHeader 컴포넌트
 * 페이지 상단의 헤더를 구성하며, 뒤로 가기 버튼과 페이지 제목을 포함합니다.
 *
 * @param {Object} props - 컴포넌트의 프로퍼티
 * @param {string} props.title - 페이지 제목
 * @returns {JSX.Element} - 페이지 헤더 구성 요소
 */
function PageHeader({ title }) {
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동을 처리

    /**
     * 뒤로 가기 버튼을 눌렀을 때 이전 페이지로 이동하는 함수
     */
    const handleGoBack = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    return (
        <div className="page-top">

            {/* 뒤로 가기 버튼, 클릭 시 handleGoBack 함수 호출 */}
            <button className="prev-page" onClick={handleGoBack}>
                <ArrowLeftLong /> {/* 뒤로 가기 아이콘 렌더링 */}
            </button>

            {/* 전달받은 페이지 제목을 표시 */}
            <h3>{title}</h3>
        </div>
    );
}

export default PageHeader;
