import React from 'react';
import { NaverMap, Marker, useNavermaps } from 'react-naver-maps';
import useGeolocation from '../../hooks/useGeolocation'

function MyMap() {
    const navermaps = useNavermaps();
    const { loaded, coordinates, error } = useGeolocation();

    return (
        <NaverMap
            center={new navermaps.LatLng(coordinates.lat, coordinates.lng)}
            defaultZoom={15}
        >
            <Marker position={new navermaps.LatLng(coordinates.lat, coordinates.lng)} />
        </NaverMap>
    );
}

export default MyMap;
