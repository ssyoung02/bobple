import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftLong } from "../imgcomponents/ImgComponents";
import '../../assets/style/components/PageHeader.css';

function PageHeader({ title }) {
    const navigate = useNavigate();

    return (
        <div className="page-top">
            <button className="prev-page" onClick={() => navigate(-1)}>
                <ArrowLeftLong />
            </button>
            <h3>{title}</h3> {/* 변수로 받아온 title을 사용 */}
        </div>
    );
}

export default PageHeader;
