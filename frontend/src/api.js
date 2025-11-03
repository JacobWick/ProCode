import axios from 'axios'
import {LANGUAGE_VERSIONS} from "./constants.js";

const pistonAPI = axios.create({
    baseURL: "https://emkc.org/api/v2/piston"
})
const backendAPI = axios.create({
    baseURL: "http://localhost:5024/api/v1",
})

export const execute = async (language, code) => {
    const response = await pistonAPI.post("/execute", {
        "language": language,
        "version": LANGUAGE_VERSIONS[language],
        files: [
            {
                content: code,
            },
        ],
    });
    return response.data;
}
export const getCourses = async () => {
    return await backendAPI.get("/courses");
}
export const getCourseById = async (id) => {
    return await backendAPI.get(`/courses/${id}`);
}