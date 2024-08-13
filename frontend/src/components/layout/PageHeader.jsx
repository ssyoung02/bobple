import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftLong } from "../imgcomponents/ImgComponents";
import '../../assets/style/components/PageHeader.css';
import { clearRecipeLocalStorage } from '../../utils/localStorageUtils';

function PageHeader({ title }) {
    const navigate = useNavigate();
    const handleGoBack = () => {
        clearRecipeLocalStorage(); // 뒤로 가기 전에 localStorage 초기화
        navigate(-1);
    };

    return (
        <div className="page-top">
            <button className="prev-page" onClick={handleGoBack}> {/* onClick 수정 */}
                <ArrowLeftLong />
            </button>
            <h3>{title}</h3> {/* 변수로 받아온 title을 사용 */}
        </div>
    );
}

export default PageHeader;
