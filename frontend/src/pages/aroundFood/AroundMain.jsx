/*global kakao*/
import React, {useEffect, useState, useRef} from 'react';
import {Map, MapMarker, ZoomControl, CustomOverlayMap} from 'react-kakao-maps-sdk';
import '../../assets/style/aroundFood/AroundMain.css';
import axios from 'axios';
import {Bookmark, FillBookmark, LocationDot, LocationTarget, SearchIcon} from "../../components/imgcomponents/ImgComponents";
import { getUserIdx } from "../../utils/auth";
import NaverImageSearch from "../../components/NaverImageSearch";
import {useNavigate} from "react-router-dom";

function AroundMain() {
    const [state, setState] = useState({
        center: {lat: 37.566826, lng: 126.9786567}, // 초기 위치 (서울 시청)
        errMsg: null,
        isLoading: true,
    });

    const [currentLocation, setCurrentLocation] = useState(null); // 현재 위치 상태 추가
    const [restaurants, setRestaurants] = useState([]); // 음식점 정보 저장
    const mapRef = useRef(null);
    const [keyword, setKeyword] = useState("");
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRestaurantImage, setSelectedRestaurantImage] = useState(null);
    const navigate = useNavigate();

    const [userBookmarks, setUserBookmarks] = useState([]);

    useEffect(() => {
        const fetchUserBookmarks = async () => {
            const userIdx = getUserIdx();
            if (userIdx) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/bookmarks/restaurants/${userIdx}`);
                    setUserBookmarks(response.data.map(bookmark => bookmark.restaurantId));
                } catch (error) {
                    console.error('북마크 정보 가져오기 실패:', error);
                }
            }
        };

        fetchUserBookmarks();
    }, []);

    const handleBookmarkToggle = async (restaurant) => {
        const userIdx = getUserIdx();
        if (userIdx) {
            try {
                const isBookmarked = userBookmarks.includes(restaurant.id);
                if (isBookmarked) {
                    const deleteResponse = await axios.delete(`http://localhost:8080/api/bookmarks/restaurants/${restaurant.id}`, {
                        data: { userIdx }
                    });

                    if (deleteResponse.status === 204) { // 삭제 성공 시
                        setUserBookmarks(prevBookmarks => prevBookmarks.filter(id => id !== restaurant.id));
                        // 북마크 상태 업데이트
                        setRestaurants(prevRestaurants => prevRestaurants.map(r =>
                            r.id === restaurant.id ? { ...r, isBookmarked: false } : r
                        ));
                    } else {
                        console.error('북마크 삭제 실패:', deleteResponse);
                        // 에러 처리 로직 추가 (필요에 따라)
                    }
                } else {
                    // 북마크 추가 요청
                    const addResponse = await axios.post('http://localhost:8080/api/bookmarks/restaurants', {
                        userIdx,
                        restaurantId: restaurant.id,
                        restaurantName: restaurant.place_name,
                        addressName: restaurant.address_name,
                        phone: restaurant.phone
                    });

                    if (addResponse.status === 200) { // 추가 성공 시
                        setUserBookmarks(prevBookmarks => [...prevBookmarks, restaurant.id]);
                        // 북마크 상태 업데이트
                        setRestaurants(prevRestaurants => prevRestaurants.map(r =>
                            r.id === restaurant.id ? { ...r, isBookmarked: true } : r
                        ));
                    } else {
                        console.error('북마크 추가 실패:', addResponse);
                        // 에러 처리 로직 추가 (필요에 따라)
                    }
                }
            } catch (error) {
                console.error('북마크 처리 실패:', error);
            }
        }
    };

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
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
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

        // 현재 지도 영역 가져오기
        const bounds = mapRef.current.getBounds();

        if (keyword) {
            // 키워드 검색
            ps.keywordSearch(keyword, (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    setRestaurants(data);
                    // 리스트에 뜨는 데이터 중 첫 번째 음식점을 지도 중앙에 배치
                    if (data.length > 0) {
                        const firstRestaurant = data[0];
                        const newCenter = {lat: firstRestaurant.y, lng: firstRestaurant.x};

                        // 지도 중심 이동 및 상태 업데이트
                        setState((prev) => ({...prev, center: newCenter}));
                        mapRef.current.setCenter(new kakao.maps.LatLng(newCenter.lat, newCenter.lng));
                    }
                } else {
                    console.error("음식점 검색 실패:", status);
                }
            }, { bounds: bounds}); // 페이지 번호 추가
        } else {
            // 카테고리 검색 (키워드가 없는 경우)
            ps.categorySearch('FD6', (data, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    setRestaurants(data);
                } else {
                    // 에러 처리 (예: alert 또는 상태 메시지 업데이트)
                    console.error("음식점 검색 실패:", status);
                }
            }, { bounds: bounds});
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
        const geocoder = new kakao.maps.services.Geocoder();

        // 주소 검색을 먼저 시도 (비동기 처리)
        geocoder.addressSearch(trimmedKeyword, (result, status) => {
            if (status === kakao.maps.services.Status.OK && result.length > 0) {
                // 검색어에 주소가 포함된 경우
                const { x, y, address_name } = result[0];
                const newCenter = { lat: y, lng: x };

                // 검색어에서 지역 정보 추출 (예: "강남구")
                const region = address_name.split(' ')[1];
                searchRestaurants(newCenter.lat, newCenter.lng, region + ' ' + trimmedKeyword); // 지역 정보 포함하여 검색
            } else {
                // 검색어에 주소가 포함되지 않은 경우 현재 위치 기준으로 검색
                if (currentLocation) {
                    searchRestaurants(currentLocation.lat, currentLocation.lng, trimmedKeyword);

                } else {
                    alert('현재 위치를 가져올 수 없습니다.');
                }
            }
        });

        ps.keywordSearch(trimmedKeyword, (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
                setRestaurants(data);
                // 리스트에 뜨는 데이터 중 첫 번째 음식점을 지도 중앙에 배치
                if (data.length > 0) {
                    const firstRestaurant = data[0];
                    const newCenter = {lat: firstRestaurant.y, lng: firstRestaurant.x};

                    // 지도 중심 이동 및 상태 업데이트
                    setState((prev) => ({...prev, center: newCenter}));
                    mapRef.current.setCenter(new kakao.maps.LatLng(newCenter.lat, newCenter.lng));
                }
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                alert('검색 결과가 존재하지 않습니다.');
            } else if (status === kakao.maps.services.Status.ERROR) {
                alert('검색 결과 중 오류가 발생했습니다.');
            }
        });
    };

    const handleListItemClick = (restaurant) => {
        // 현재 위치와 선택된 리스트 아이템 사이의 거리 계산
        const distance = computeDistance(currentLocation, { lat: restaurant.y, lng: restaurant.x });

        setSelectedMarker({ ...restaurant, distance }); // 리스트 아이템 클릭 시 해당 마커 선택 (distance 추가)
        setIsOpen(true); // CustomOverlayMap 열기

        if (mapRef.current) {
            mapRef.current.panTo(new kakao.maps.LatLng(restaurant.y, restaurant.x));
        }
    };

    // 두 지점 간의 거리 계산 함수 (미터 단위)
    const computeDistance = (startCoords, destCoords) => {
        if (!startCoords || !destCoords) return 0;

        const linePath = [
            new kakao.maps.LatLng(startCoords.lat, startCoords.lng),
            new kakao.maps.LatLng(destCoords.lat, destCoords.lng)
        ];

        const polyline = new kakao.maps.Polyline({ path: linePath });

        return polyline.getLength(); // Polyline의 길이를 통해 거리 계산
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

    const handleImageLoaded = (imageUrl) => {
        // 이미지 로드 완료 시 호출되는 콜백 함수
        if (imageUrl) {
            // 이미지가 성공적으로 로드된 경우
        } else {
            // 이미지를 찾지 못했거나 에러 발생 시
            console.warn("이미지 로드 실패 또는 이미지 없음");
            // 필요에 따라 기본 이미지 설정 또는 에러 처리
        }
    };

    return (
        <div className="map-container">
            {/* 검색창 */}
            <div className="SearchInput">
                <input
                    className="AllSaerchBox"
                    type="text"
                    placeholder="검색 키워드를 입력해주세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <button className="AllSearchButton" onClick={handleSearch} aria-label={"검색"}>
                    <SearchIcon/>
                </button>
            </div>
            {/* 지도 */}

            <Map
                center={state.center}
                style={{width: "100%", height: "300px"}}
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
                        position={{lat: restaurant.y, lng: restaurant.x}}
                        onClick={() => handleListItemClick(restaurant)}
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
                        position={{lat: selectedMarker.y, lng: selectedMarker.x}}
                        xAnchor={0}
                        yAnchor={1.2} // 오버레이가 마커 위에 위치하도록 설정
                    >
                        <div className="wrap">
                            <div className="info">
                                <div className="title">
                                    <div>
                                        <div
                                            onClick={() => navigate(`/recommend/restaurant/${selectedMarker.id}`, { state: { restaurant: selectedMarker }})}>
                                            {selectedMarker.place_name}
                                        </div>
                                        <button className="around-bookmark"
                                                onClick={() => handleBookmarkToggle(selectedMarker)}>
                                            {userBookmarks.includes(selectedMarker.id) ? (
                                                <FillBookmark/>
                                            ) : (
                                                <Bookmark/>
                                            )}
                                        </button>
                                    </div>
                                    <div className="close" onClick={() => setIsOpen(false)} title="닫기"></div>
                                </div>
                                <div className="body">
                                    <div className="desc">
                                        <div className="ellipsis">{selectedMarker.road_address_name || selectedMarker.address_name}</div>
                                        <div className="tel">{selectedMarker.phone}</div>
                                        <span className="distance">
                                            <LocationDot/>{Math.round(selectedMarker.distance)}m
                                        </span>
                                    </div>
                                    <div className="img">
                                        <div className="restaurant-image-wrapper">
                                            {/* NaverImageSearch 컴포넌트 사용 */}
                                            <NaverImageSearch
                                                restaurantName={selectedMarker.place_name}
                                                onImageLoaded={handleImageLoaded}
                                                alt={selectedMarker.place_name}
                                                width="73"
                                                height="70"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CustomOverlayMap>
                )}

                <ZoomControl position={"RIGHT"}/>
                <button className="current-location-button" onClick={handleCurrentLocationClick}>
                    <LocationTarget/>
                </button>

                {/* 현재 위치 표시 (CustomOverlayMap 사용) */}
                {currentLocation && (
                    <CustomOverlayMap
                        position={currentLocation}
                        yAnchor={1}
                        zIndex={10}
                    >
                        <div className="current-location-marker">
                            <svg className="current-location-svg">
                                <circle cx="10" cy="10" r="9.5" fill="#FF0000" stroke="#FFF" strokeWidth="6"/>
                            </svg>
                        </div>
                    </CustomOverlayMap>
                )}
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
                        <div className="category-list">
                            <p>{restaurant.category_name.replace('음식점 > ', '')}</p>
                            <button
                                className="around-bookmark list-bookmark"
                                onClick={(e) => {
                                    e.stopPropagation(); // 클릭 이벤트 전파 방지
                                    if (restaurant) {
                                        handleBookmarkToggle(restaurant);
                                    }
                                }}
                            >
                                {userBookmarks.includes(restaurant.id) ? (
                                    <FillBookmark/>
                                ) : (
                                    <Bookmark/>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AroundMain;