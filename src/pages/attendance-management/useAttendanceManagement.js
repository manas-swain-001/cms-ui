import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrentStatus } from 'api/attendance';
import { useGlobalContext } from 'context';
import constants from 'constant';

const officeLocation = constants.officeLocation;

export const useAttendanceManagement = () => {

    const [officeDistance, setOfficeDistance] = useState(0);
    const [formattedDistance, setFormattedDistance] = useState('0 m');
    const [gpsStatus, setGpsStatus] = useState({
        latitude: 0,
        longitude: 0,
        accuracy: 'unknown',
        error: null,
    });

    const { userDataContext, setCurrentStatus } = useGlobalContext();

    const { data: currentStatusData, refetch: refetchCurrentStatus } = useQuery({
        queryKey: ['currentStatusData'],
        queryFn: getCurrentStatus,
    });

    useEffect(() => {
        if (currentStatusData) {
            const { status = 'not_punched_in' } = currentStatusData || {};
            if (currentStatusData?.currentStatus) {
                setCurrentStatus(constants.attendanceStatus[currentStatusData?.currentStatus]);
                return;
            }
            setCurrentStatus(constants.attendanceStatus[status]);
        }
    }, [currentStatusData]);

    // Correct distance calculation using Haversine formula
    const calculateDistance = (officeLoc, userLoc) => {
        const R = 6371000; // Earth's radius in meters
        const dLat = (userLoc.latitude - officeLoc.latitude) * Math.PI / 180;
        const dLon = (userLoc.longitude - officeLoc.longitude) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(officeLoc.latitude * Math.PI / 180) *
            Math.cos(userLoc.latitude * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in meters

        return distance;
    }

    // Format distance with rounding and unit conversion
    const formatDistance = (distanceInMeters) => {
        // Round to nearest whole number for meters
        const roundedMeters = Math.round(distanceInMeters);

        if (roundedMeters >= 1000) {
            // Convert to kilometers and round to 1 decimal place
            const distanceInKm = roundedMeters / 1000;
            return `${distanceInKm.toFixed(1)} km`;
        } else {
            return `${roundedMeters} m`;
        }
    }

    // Fixed accuracy determination
    const getAccuracyLevel = (accuracy) => {
        if (accuracy <= 10) return 'high';
        if (accuracy <= 50) return 'medium';
        return 'low';
    }

    const getCurrentPosition = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // console.log("Position: ", position);
                    const userCoords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    setGpsStatus({
                        latitude: userCoords.latitude,
                        longitude: userCoords.longitude,
                        // accuracy: getAccuracyLevel(position.coords.accuracy),
                        accuracy: position.coords.accuracy,
                        error: null,
                    });

                    const distance = calculateDistance(officeLocation, userCoords);
                    const formatted = formatDistance(distance);

                    setOfficeDistance(distance);
                    setFormattedDistance(formatted);

                    // console.log(`Distance from office: ${formatted}`);
                },
                (err) => {
                    // console.log("Error: ", err);
                    setGpsStatus({
                        latitude: 0,
                        longitude: 0,
                        accuracy: 'unknown',
                        error: err.message,
                    });
                    setOfficeDistance(0);
                    setFormattedDistance('0 m');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000
                }
            );
        } else {
            // console.log("Geolocation is not supported by your browser.");
            setGpsStatus({
                latitude: 0,
                longitude: 0,
                accuracy: 'unknown',
                error: "Geolocation is not supported by your browser.",
            });
            setOfficeDistance(0);
            setFormattedDistance('0 m');
        }
    }

    useEffect(() => {
        // Get initial position immediately
        getCurrentPosition();

        // Then set up interval for updates
        const interval = setInterval(() => {
            getCurrentPosition();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return {
        gpsStatus,
        setGpsStatus,
        officeDistance, // Raw distance in meters
        formattedDistance, // Formatted string (e.g., "150 m" or "1.5 km")
        setOfficeDistance,
        refetchCurrentStatus,
    }
}