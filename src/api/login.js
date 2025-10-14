import { endpoint } from "constant/endpoint";
import { request } from "requester";

const login = async (payload) => {
    try {
        const res = await request().post(endpoint.login, payload);
        return res?.data;
    } catch (error) {
        throw error;
    }
}

export { login };