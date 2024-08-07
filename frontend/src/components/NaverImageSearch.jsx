import React, {useState, useEffect} from 'react';
import axios from 'axios';

function NaverImageSearch({restaurantName, onImageLoaded}) {
    const [imageUrl, setImageUrl] = useState(null);
    // 기본 이미지 경로 설정
    const defaultImageUrl = '/bobple_mascot_icon.png';

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/naver/image', {
                    params: {
                        query: `${restaurantName}`
                    }
                });
                //console.log(`${restaurantName}`)
                if (response.data && response.data.link) { // 이미지 링크가 있는 경우에만 처리
                    setImageUrl(response.data.link);
                    onImageLoaded(response.data.link);
                } else {
                    console.error('네이버 이미지 검색 결과 없음');
                    onImageLoaded(null);
                }
            } catch (error) {
                console.error('네이버 이미지 검색 에러:', error);
                onImageLoaded(null);
            }
        };

        fetchImage();
    }, [restaurantName]);

    return (
        <img
            src={imageUrl || defaultImageUrl} // imageUrl이 null이면 defaultImageUrl 사용
            alt={restaurantName}
            onError={() => { // 이미지 로드 에러 시 defaultImageUrl로 변경
                setImageUrl(defaultImageUrl);
            }}
        />
    )
}

export default NaverImageSearch;
