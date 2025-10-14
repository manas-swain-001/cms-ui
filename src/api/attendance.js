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

export { punchIn, punchOut };