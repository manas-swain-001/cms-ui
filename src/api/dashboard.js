import { endpoint } from "constant/endpoint";
import { request } from "requester";

const dashboardData = async () => {
    try {
        const res = await request().get(endpoint.dashboard.adminOverview);
        return res?.data?.summary || {};
    } catch (error) {
        throw error;
    }
}

const getEmployeesDropdown = async () => {
    try {
        const res = await request().get(endpoint.dashboard.employeesDropdown);
        return res?.data?.employees || [];
    } catch (error) {
        throw error;
    }
}

export { dashboardData, getEmployeesDropdown };