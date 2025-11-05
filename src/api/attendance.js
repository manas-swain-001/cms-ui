import { endpoint } from "constant/endpoint";
import { request } from "requester";

const punchIn = async (payload) => {
    try {
        const res = await request().post(endpoint.punchIn, payload);
        return res;
    } catch (error) {
        throw error;
    }
}
const punchOut = async (payload) => {
    try {
        const res = await request().post(endpoint.punchOut, payload);
        return res;
    } catch (error) {
        throw error;
    }
}

const getCurrentStatus = async () => {
    try {
        const res = await request().get(endpoint.getCurrentStatus);
        return res?.data;
    } catch (error) {
        throw error;
    }
}


const getRecords = async (headers) => {
    try {
        const res = await request().get(endpoint.attendance.records, undefined, { ...headers });
        return res?.data?.attendanceRecords || [];
    } catch (error) {
        throw error;
    }
}

const attendanceHistory = async () => {
    try {
        const res = await request().get(endpoint.attendance.attendanceHistory);
        return res?.data || [];
    } catch (error) {
        throw error;
    }
}

const exportExcel = async (headers) => {
    try {
        const requester = request({ responseType: 'blob' });
        const res = await requester.get(endpoint.attendance.exportExcel, undefined, { ...headers });
        return res;
    } catch (error) {
        throw error;
    }
}



export { punchIn, punchOut, getCurrentStatus, getRecords, exportExcel, attendanceHistory };