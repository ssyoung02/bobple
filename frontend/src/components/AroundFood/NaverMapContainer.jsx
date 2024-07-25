import React from 'react';
import { Container as MapDiv } from 'react-naver-maps';
import MyMap from './MyMap';

function NaverMapContainer() {
    return (
        <MapDiv style={{ width: '100%', height: '800px' }}>
            <MyMap />
        </MapDiv>
    );
}

export default NaverMapContainer;
