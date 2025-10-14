import { endpoint } from "constant/endpoint";
import { request } from "requester";

const getAllUsers = async () => {
    try {
        const res = await request().get(endpoint.users.getAllUsers);
        return res?.data;
    } catch (error) {
        throw error;
    }
}

const saveUser = async (payload) => {
    try {
        const res = await request().post(endpoint.users.saveUser, payload);
        return res?.data;
    } catch (error) {
        throw error;
    }
}

export { getAllUsers, saveUser };