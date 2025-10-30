export const endpoint = {
    login: "auth/login",
    punchIn: "attendance/punch-in",
    punchOut: "attendance/punch-out",
    getCurrentStatus: "attendance/today",
    attendance: {
        records: 'attendance/records',
        exportExcel: 'attendance/export-excel'
    },
    dashboard: {
        adminOverview: "dashboard/admin-overview",
        employeesDropdown: "dashboard/employees-dropdown",
    },
    tasks: {
        completeTasks: "tasks/completed-updates",
        submitUpdate: "tasks/submit-update",
        tasksHistory: "tasks/history",
    },
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