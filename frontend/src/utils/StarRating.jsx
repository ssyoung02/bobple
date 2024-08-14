import { FaRegStar, FaStar } from 'react-icons/fa';
import styled from "styled-components";
import { useState, useEffect } from "react";

const StarSection = styled.div`
    .star {
        color: #f6f605;
        font-size: 32px;
        cursor: pointer;
    }
`;

const StarRating = ({ initialRating = 0, onRatingChange }) => {
    const [starScore, setStarScore] = useState(initialRating);

    useEffect(() => {
        setStarScore(initialRating);  // 초기화 시 초기 값을 설정
    }, [initialRating]);

    const ratingStarHandler = () => {
        let result = [];
        for (let i = 0; i < 5; i++) {
            result.push(
                <span key={i + 1} onClick={() => handleStarClick(i + 1)}>
                    {i + 1 <= starScore ? (
                        <FaStar className="star" />
                    ) : (
                        <FaRegStar className="star" />
                    )}
                </span>
            );
        }
        return result;
    };

    const handleStarClick = (score) => {
        setStarScore(score);
        onRatingChange(score);  // 부모 컴포넌트로 선택된 별점 전달
    };

    return <StarSection>{ratingStarHandler()}</StarSection>;
};

export default StarRating;
