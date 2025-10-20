export const endpoint = {
    login: "auth/login",
    punchIn: "attendance/punch-in",
    punchOut: "attendance/punch-out",
    getCurrentStatus: "attendance/today",
    users: {
        getAllUsers: "users",
        saveUser: "users/save",
        getUserById: "users/",
        updateUser: "users/",
    },
    sms: {
        sendSalarySms: "sms/salary",
        sendGreetingSms: "sms/greeting",
    }
}