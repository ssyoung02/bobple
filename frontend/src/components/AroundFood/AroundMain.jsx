import React from 'react';
import { NavermapsProvider } from 'react-naver-maps';
import NaverMapContainer from './NaverMapContainer';
import '../../css/AroundMain.css'
function AroundMain() {
    return (
        <NavermapsProvider ncpClientId={process.env.REACT_APP_NAVER_MAP_API_KEY}>
            <NaverMapContainer />
        </NavermapsProvider>
    );
}

export default AroundMain;
