import { endpoint } from "constant/endpoint";
import { request } from "requester";

const sendSalarySms = async (payload) => {
    try {
        const res = await request().post(endpoint.sms.sendSalarySms, payload);
        return res?.data;
    } catch (error) {
        throw error;
    }
}

const sendGreetingSms = async (payload) => {
    try {
        const res = await request().post(endpoint.sms.sendGreetingSms, payload);
        return res?.data;
    } catch (error) {
        throw error;
    }
}

export { sendSalarySms, sendGreetingSms };
