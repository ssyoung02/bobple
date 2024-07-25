import { useState, useEffect } from 'react';

function useGeolocation() {
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: { lat: 37.5665, lng: 126.9780 },
        error: null,
    });

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setLocation({
                loaded: true,
                coordinates: { lat: 37.5665, lng: 126.9780 },
                error: {
                    code: 0,
                    message: "Geolocation not supported",
                },
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    loaded: true,
                    coordinates: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    error: null,
                });
            },
            (error) => {
                setLocation({
                    loaded: true,
                    coordinates: { lat: 37.5665, lng: 126.9780 },
                    error,
                });
            }
        );
    }, []);

    return location;
}

export default useGeolocation;
