import { useState } from "react";

export default function useAttendance() {

    const [currentStatus, setCurrentStatus] = useState('checked_out'); // checked_in, checked_out
    
    return {
        currentStatus,
        setCurrentStatus
    }
}