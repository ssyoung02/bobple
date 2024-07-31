/*global kakao*/
import React, {useEffect, useState, useRef} from 'react';
import {Map, MapMarker, ZoomControl, CustomOverlayMap} from 'react-kakao-maps-sdk';
import '../../assets/style/AroundMain.css';
import axios from 'axios';

function AroundMain() {
    const [state, setState] = useState({
        center: {lat: 37.566826, lng: 126.9786567}, // 초기 위치 (서울 시청)
        errMsg: null,
        isLoading: true,
    });

    const [restaurants, setRestaurants] = useState([]); // 음식점 정보 저장
    const mapRef = useRef(null);
    const [keyword, setKeyword] = useState("");
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRestaurantImage, setSelectedRestaurantImage] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    setState((prev) => ({
                        ...prev,
                        center: {lat: latitude, lng: longitude},
                        isLoading: false,
                    }));

                    // 지도 중심 설정 및 음식점 검색
                    const map = mapRef.current;
                    if (map) {
                        map.setCenter(new kakao.maps.LatLng(latitude, longitude));
                        searchRestaurants(latitude, longitude);
                    }
                },
                (err) => {
                    setState((prev) => ({
                        ...prev,
                        errMsg: err.message,
                        isLoading: false,
                    }));
                }
            );
        } else {
            setState((prev) => ({
                ...prev,
                errMsg: "geolocation을 사용할 수 없어요..",
                isLoading: false,
            }));
        }
    }, []);

    const searchRestaurants = (latitude, longitude, keyword = "") => {
        // 음식점 검색 (카테고리 FD6: 음식점)
        const ps = new kakao.maps.services.Places();

        // 현재 지도 중심 좌표를 기준으로 검색 영역 설정 (예시: 반경 500m)
        const bounds = new kakao.maps.LatLngBounds(
            new kakao.maps.LatLng(latitude - 0.005, longitude - 0.005),
            new kakao.maps.LatLng(latitude + 0.005, longitude + 0.005)
        );

        if (keyword) {
            // 키워드 검색
            ps.keywordSearch(keyword, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    setRestaurants(data);
                } else {
                    // 에러 처리 (예: alert 또는 상태 메시지 업데이트)
                    console.error("음식점 검색 실패:", status);
                }
            }, {bounds: bounds});
        } else {
            // 카테고리 검색 (키워드가 없는 경우)
            ps.categorySearch('FD6', (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    setRestaurants(data);
                } else {
                    // 에러 처리 (예: alert 또는 상태 메시지 업데이트)
                    console.error("음식점 검색 실패:", status);
                }
            }, {bounds: bounds}); // 검색 영역 설정
        }
    };

    const handleCurrentLocationClick = () => {
        if (navigator.geolocation && mapRef.current) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newCenter = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setState((prev) => ({...prev, center: newCenter}));
                    mapRef.current.setCenter(new kakao.maps.LatLng(newCenter.lat, newCenter.lng));
                },
                (err) => {
                    setState((prev) => ({...prev, errMsg: err.message}));
                }
            );
        } else {
            setState((prev) => ({...prev, errMsg: "geolocation을 사용할 수 없어요.."}));
        }
    };
    const handleSearch = () => {
        if (mapRef.current) {
            const center = mapRef.current.getCenter();
            searchRestaurants(center.getLat(), center.getLng(), keyword);
        }
    };


    function onMarkerClick(restaurant) {
        setSelectedMarker(restaurant); // 선택된 마커 업데이트
        setIsOpen(true); // CustomOverlayMap 열기
    }

    const handleListItemClick = (restaurant) => {
        setSelectedMarker(restaurant); // 리스트 아이템 클릭 시 해당 마커 선택
        setIsOpen(true); // CustomOverlayMap 열기
    };

    useEffect(() => {
        // 선택된 마커가 변경될 때마다 음식점 이미지 가져오기
        if (selectedMarker) {
            const placeId = selectedMarker.id;
            axios.get(`https://dapi.kakao.com/v2/local/search/keyword.json`, {
                params: {
                    query: selectedMarker.place_name,
                    x: selectedMarker.x,
                    y: selectedMarker.y,
                },
                headers: {
                    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_MAP_APP_KEY}`, // 환경 변수 사용
                },
            })
                .then(response => {
                    const place = response.data.documents[0]; // 검색 결과에서 첫 번째 장소 정보 가져오기
                    if (place && place.id === placeId && place.thumbnail) { // 장소 ID와 썸네일 이미지 존재 여부 확인
                        setSelectedRestaurantImage(place.thumbnail);
                    } else {
                        setSelectedRestaurantImage(null); // 썸네일 이미지가 없으면 null 설정
                    }
                })
                .catch(error => {
                    console.error("음식점 이미지 가져오기 실패:", error);
                    setSelectedRestaurantImage(null); // 에러 발생 시 null 설정
                });
        } else {
            setSelectedRestaurantImage(null); // 선택된 마커가 없으면 null 설정
        }
    }, [selectedMarker]);


    return (
        <div className="map-container">
            {/* 검색창 */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="음식점 검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="search-input"
                />
                <button onClick={handleSearch}>검색</button>
            </div>
            {/* 지도 */}
            <Map
                center={state.center}
                className="main-map"
                level={3}
                ref={mapRef}
            >

                {/* 음식점 마커 표시 */}
                {restaurants.map((restaurant) => (
                    <MapMarker
                        key={restaurant.id}
                        position={{ lat: restaurant.y, lng: restaurant.x }}
                        onClick={() => onMarkerClick(restaurant)}
                        image={{
                            src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                            size: {
                                width: 24,
                                height: 35,
                            },
                        }}
                    />
                ))}

                {/* CustomOverlayMap 컴포넌트 */}
                {isOpen && selectedMarker && (
                    <CustomOverlayMap
                        position={{ lat: selectedMarker.y, lng: selectedMarker.x }}
                        yAnchor={1} // 오버레이가 마커 아래에 위치하도록 설정
                    >
                        <div className="wrap">
                            <div className="info">
                                <div className="title">
                                    {selectedMarker.place_name}
                                    <div className="close" onClick={() => setIsOpen(false)} title="닫기"></div>
                                </div>
                                <div className="body">
                                    <div className="img">
                                        <img
                                            src={selectedRestaurantImage || "https://t1.daumcdn.net/thumb/C84x76/?fname=http://t1.daumcdn.net/cfile/2170353A51B82DE005"}
                                            width="73"
                                            height="70"
                                            alt={selectedMarker.place_name}
                                        />
                                    </div>
                                    <div className="desc">
                                        <div
                                            className="ellipsis">{selectedMarker.road_address_name || selectedMarker.address_name}</div>
                                        {selectedMarker.road_address_name && (
                                            <div className="jibun ellipsis">(지번: {selectedMarker.address_name})</div>
                                        )}
                                        <div>
                                            <a href={selectedMarker.place_url} target="_blank" className="link"
                                               rel="noreferrer">
                                                홈페이지
                                            </a>
                                        </div>
                                        <div className="tel">{selectedMarker.phone}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CustomOverlayMap>
                )}

                <ZoomControl position={"RIGHT"}/>
                <button className="current-location-button" onClick={handleCurrentLocationClick}>
                    현재 위치
                </button>
            </Map>

            {/* 음식점 목록 (간략 정보만 표시) */}
            <div className="list-container">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="list-item"
                        onClick={() => handleListItemClick(restaurant)}
                    >
                        {restaurant.place_name}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AroundMain;