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

const getUserById = async (id) => {
    try {
        const res = await request().get(endpoint.users.getUserById + id);
        return res?.data;
    } catch (error) {
        throw error;
    }
}

const updateUser = async (id, payload) => {
    console.log('payload :::::::: ', payload);
    console.log('id :::::::: ', id);
    try {
        const res = await request().put(endpoint.users.updateUser + id, payload);
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

export { getAllUsers, saveUser, getUserById, updateUser };