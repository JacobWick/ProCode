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
export const executeSolution = async (language, code, stdin = "") => {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            language: language,
            version: '*',
            files: [
                {
                    name: 'main',
                    content: code
                }
            ],
            stdin: stdin,
            args: [],
            compile_timeout: 10000,
            run_timeout: 3000,
            compile_memory_limit: -1,
            run_memory_limit: -1
        })
    });

    return await response.json();
};

backendAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

backendAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const createCourse = async (courseData) => {
    return await backendAPI.post("/courses", courseData);
}
export const getCourses = async () => {
    return await backendAPI.get("/courses");
}
export const getCourseById = async (id) => {
    return await backendAPI.get(`/courses/${id}`);
}
export const createLesson = async (lessonData) => {
    return await backendAPI.post("/lessons", lessonData);
}
export const getLessons = async () => {
    return await backendAPI.get("/lessons");
}
export const getLessonById = async (id) => {
    return await backendAPI.get(`/lessons/${id}`);
}
export const getExercises = async () => {
    return await backendAPI.get("/exercise");
}
export const createExercise = async (exerciseData) => {
    return await backendAPI.post("/exercise", exerciseData);
}
export const getExerciseById = async (id) => {
    return await backendAPI.get(`/exercise/${id}`);
}
export const login = async (data) => {
    return await backendAPI.post(`/auth/login`, data)
}
export const register = async (data) => {
    return await backendAPI.post(`/auth/register`, data)
}
    export const createTest = async (testData) => {
        return await backendAPI.post("/tests", testData);
    }
    export const createSolutionExample = async (solutionExampleData) => {
        return await backendAPI.post("/solutionexamples", solutionExampleData);

    }

export const getMyProfile = async () => {
    return await backendAPI.get(`/profiles/me`)
}
export const getCourseProgress = async (id) => {
    return await backendAPI.get(`/courses/${id}/progress`)
}
export const getUsers = async () => {
    return await backendAPI.get("/user");
}
export const getUserById = async (id) => {
    return await backendAPI.get(`/user/${id}`);
}
export const createUser = async (userData) => {
    return await backendAPI.post("/user", userData);
}
export const updateUser = async (id, userData) => {
    return await backendAPI.patch(`/user/${id}`, userData);
}
export const deleteUser = async (id) => {
    return await backendAPI.delete(`/user/${id}`);
} 
export const editProfile = async (data) => {
    return await backendAPI.patch(`/profiles/me`, data);
} 
export const getRecommendedCourses = async (data) => {
    return await backendAPI.get(`courses/recommended`, data);
} 
export const getUserTags = async () => {
    return await backendAPI.get(`/profiles/me/interests`);
}
export const updateUserTags = async (tags) => {
    return await backendAPI.put(`/profiles/me/interests`, {tags});
}
export const getAllTags = async () => {
    return await backendAPI.get(`/tags`);
}

