import { useState } from "react";

export default function useProfileContext() {

    const [userProfile, setUserProfile] = useState({
        "firstName": "",
        "lastName": "",
        "email": "",

        "role": "",
        "permissions": [],

        "office": "",
        "department": "",
        "designation": "",
        "employeeId": "",

        "phone": "",
        "accNo": "",
        "salary": "",
        "address": {
            "street": "",
            "city": "",
            "state": "",
            "country": "",
            "zipCode": ""
        },

        "avatar": null,
        "dateOfBirth": null,
        "joiningDate": null,

        "biometricData": {
            "faceEncoding": null,
            "fingerprintHash": null,
            "isEnrolled": false,
            "enrolledAt": null
        },

        "preferences": {
            "theme": "",
            "language": "",
            "notifications": {
                "email": true,
                "push": true,
                "sms": false
            },
            "timezone": ""
        },

        "workSchedule": {
            "shiftType": "morning",
            "workingHours": {
                "start": "09:00",
                "end": "18:00"
            },
            "workingDays": ["monday", "tuesday", "wednesday", "thursday", "friday"]
        },
    });

    return {
        userProfile, setUserProfile
    }
}