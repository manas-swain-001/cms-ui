import { baseUrl } from "constant";
import axiosInstance from "../interceptors";
import { endpoint } from "constant/endpoint";

const punchIn = async (payload) => {
    try {
        const { data } = await axiosInstance.post(`${baseUrl}${endpoint?.punchIn}`, payload);
        return data;
    } catch (error) {
        return error.message;
    }
}

export { punchIn };