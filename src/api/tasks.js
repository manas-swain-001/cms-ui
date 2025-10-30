import { endpoint } from "constant/endpoint";
import { request } from "requester";

const completeTasks = async () => {
    try {
        const res = await request().get(endpoint.tasks.completeTasks);
        return res?.data?.updates || [];
    } catch (error) {
        throw error;
    }
}

const submitUpdate = async (data) => {
    try {
        const res = await request().post(endpoint.tasks.submitUpdate, data);
        return res?.data;
    } catch (error) {
        throw error;
    }
}

const getTasksHistory = async (headers) => {
    try {
        console.log('headers :::: ', headers);
        const res = await request().get(endpoint.tasks.tasksHistory, undefined, { ...headers });
        return res?.data?.tasks || [];
    } catch (error) {
        throw error;
    }
}

export { completeTasks, submitUpdate, getTasksHistory };
