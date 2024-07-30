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
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
    const [pagination, setPagination] = useState(null); // pagination 객체 상태 추가

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

    const searchRestaurants = (latitude, longitude, keyword = "", page = 1) => {
        // 음식점 검색 (카테고리 FD6: 음식점)
        const ps = new kakao.maps.services.Places();

        // 현재 지도 영역 가져오기
        const bounds = mapRef.current.getBounds();

        if (keyword) {
            // 키워드 검색
            ps.keywordSearch(keyword, (data, status, pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    setRestaurants(data);
                    setPagination(pagination);
                    // 검색 결과 중 첫 번째 음식점을 선택 (기존의 위치 기반 검색과 동일한 동작)
                    if (data.length > 0) {
                        onMarkerClick(data[0]);
                    }
                } else {
                    // 에러 처리 (예: alert 또는 상태 메시지 업데이트)
                    console.error("음식점 검색 실패:", status);
                }
            }, { bounds: bounds, page: page }); // 페이지 번호 추가
        } else {
            // 카테고리 검색 (키워드가 없는 경우)
            ps.categorySearch('FD6', (data, status, pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    setRestaurants(data);
                    setPagination(pagination);
                } else {
                    // 에러 처리 (예: alert 또는 상태 메시지 업데이트)
                    console.error("음식점 검색 실패:", status);
                }
            }, { bounds: bounds, page: page }); // 페이지 번호 추가
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
        const trimmedKeyword = keyword.trim();
        if (!trimmedKeyword) {
            alert('키워드를 입력해주세요!');
            return;
        }
        setIsOpen(false);
        const ps = new kakao.maps.services.Places();

        ps.keywordSearch(trimmedKeyword, (data, status, pagination) => {
            if (status === kakao.maps.services.Status.OK) {
                setRestaurants(data);
                setPagination(data.length > 0 ? pagination : null); // 검색 결과가 있을 때만 pagination 설정
                setCurrentPage(1);
                console.log(pagination);
                // 검색 결과 중 첫 번째 음식점을 선택 (기존의 위치 기반 검색과 동일한 동작)
                if (data.length > 0) {
                    onMarkerClick(data[0]);
                }
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                alert('검색 결과가 존재하지 않습니다.');
            } else if (status === kakao.maps.services.Status.ERROR) {
                alert('검색 결과 중 오류가 발생했습니다.');
            }
        });
    };


    // 페이지 이동 함수
    const handlePageChange = (page) => {
        if (!pagination || page < 1 || page > pagination.last) {
            return; // 유효하지 않은 페이지 번호일 경우 함수 종료
        }

        setCurrentPage(page);
        searchRestaurants(state.center.lat, state.center.lng, keyword, page); // 페이지 번호를 검색 함수에 전달
    };

    function onMarkerClick(restaurant) {
        setSelectedMarker(restaurant); // 선택된 마커 업데이트
        setIsOpen(true); // CustomOverlayMap 열기

        // 커스텀 오버레이 맵을 지도 중앙으로 이동
        if (mapRef.current) {
            mapRef.current.panTo(new kakao.maps.LatLng(restaurant.y, restaurant.x));
        }
    }

    const handleListItemClick = (restaurant) => {
        setSelectedMarker(restaurant); // 리스트 아이템 클릭 시 해당 마커 선택
        setIsOpen(true); // CustomOverlayMap 열기

        // 커스텀 오버레이 맵을 지도 중앙으로 이동
        if (mapRef.current) {
            mapRef.current.panTo(new kakao.maps.LatLng(restaurant.y, restaurant.x));
        }
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
                    Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_MAP_SEARCH_APP_KEY}`, // 환경 변수 사용
                },
            })
                .then(response => {
                    console.log("음식점 검색 API 전체 응답:", response.data); // 전체 응답 출력
                    const place = response.data.documents[0]; // 검색 결과에서 첫 번째 장소 정보 가져오기
                    if (place && place.id === placeId) { // 장소 ID 일치 여부만 확인
                        //추후 네이버 서치 이용해서 썸네일 사진 구현 예정
                    }
                })
                .catch(error => {
                    console.error("음식점 정보 가져오기 실패:", error);
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
                    onKeyDown={(e) => {   // onKeyDown 이벤트 사용
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    className="search-input"
                />
                <button onClick={handleSearch}>검색</button>
            </div>
            {/* 지도 */}
            <Map
                center={state.center}
                style={{ width: "400px", height: "500px" }}
                level={3}
                ref={mapRef}
                onDragEnd={() => {
                    const center = mapRef.current.getCenter();
                    searchRestaurants(center.getLat(), center.getLng(), keyword);
                }}
                onZoomChanged={() => {
                    const center = mapRef.current.getCenter();
                    searchRestaurants(center.getLat(), center.getLng(), keyword);
                }}
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
                        xAnchor={0}
                        yAnchor={1.2} // 오버레이가 마커 위에 위치하도록 설정
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
                {/* 페이지네이션 버튼 */}
                <div className="pagination">
                    {pagination && (
                        <>
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>이전
                            </button>
                            <span>{currentPage} / {pagination.last}</span>
                            <button onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.last}>다음
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AroundMain;