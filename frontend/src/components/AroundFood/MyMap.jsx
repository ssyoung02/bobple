import React, { useState, useEffect } from 'react';
import { NaverMap, Marker, useNavermaps } from 'react-naver-maps';
import useGeolocation from '../../hooks/useGeolocation';
import axios from 'axios';

function MyMap() {
    const navermaps = useNavermaps();
    const { loaded, coordinates, error } = useGeolocation();
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        if (loaded && !error) {
            const searchQuery = '음식점';
            const displayCount = 20;
            const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(searchQuery)}&display=${displayCount}&start=1&sort=random`;

            axios.get(url, {
                headers: {
                    'X-Naver-Client-Id': process.env.REACT_APP_NAVER_SEARCH_CLIENT_ID,
                    'X-Naver-Client-Secret': process.env.REACT_APP_NAVER_SEARCH_CLIENT_SECRET,
                },
                params: {
                    longitude: coordinates.lng,
                    latitude: coordinates.lat,
                },
            })
                .then(response => {
                    setRestaurants(response.data.items);
                })
                .catch(error => {
                    console.error('Error fetching restaurant data:', error);
                });
        }
    }, [loaded, coordinates, error, navermaps]); // navermaps 객체를 추가

    return (
        <NaverMap
            center={new navermaps.LatLng(coordinates.lat, coordinates.lng)}
            defaultZoom={15}
        >
            {/* 현재 위치 마커 */}
            {loaded && !error && <Marker position={new navermaps.LatLng(coordinates.lat, coordinates.lng)} />}

            {/* 음식점 마커 */}
            {restaurants.map(restaurant => (
                <Marker
                    key={restaurant.title}
                    position={new navermaps.LatLng(restaurant.mapy, restaurant.mapx)} // 네이버 지도 API 응답 형식에 맞게 수정
                    title={restaurant.title}
                />
            ))}
        </NaverMap>
    );
}

export default MyMap;
