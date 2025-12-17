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
export const updateCourse = async (courseId, courseData) => {
    return await backendAPI.put(`/courses/${courseId}`, courseData);
}
export const deleteCourse = async (courseId) => {
    return await backendAPI.delete(`/courses/${courseId}`);
}
export const getCourses = async () => {
    return await backendAPI.get("/courses");
}
export const getCourseById = async (courseId) => {
    return await backendAPI.get(`/courses/${courseId}`);
}

export const getCourseDetails = async (courseId) => {
    return await backendAPI.get(`/courses/${courseId}/details`);
}
export const createLesson = async (lessonData) => {
    return await backendAPI.post("/lessons", lessonData);
}
export const updateLesson = async (lessonId, lessonData) => {
    return await backendAPI.put(`/lessons/${lessonId}`, lessonData);
}
export const deleteLesson = async (lessonId) => {
    return await backendAPI.delete(`/lessons/${lessonId}`);
}
export const getLessons = async () => {
    return await backendAPI.get("/lessons");
}
export const getLessonById = async (id) => {
    return await backendAPI.get(`/lessons/${id}`);
}
export const getExercises = async () => {
    return await backendAPI.get("/exercises");
}
export const createExercise = async (exerciseData) => {
    return await backendAPI.post("/exercises", exerciseData);
}
export const updateExercise = async (exerciseId, exerciseData) => {
    return await backendAPI.put(`/exercises/${exerciseId}`, exerciseData);
}
export const deleteExercise = async (id) => {
    return await backendAPI.delete(`/exercises/${id}`);
}
export const getExerciseById = async (id) => {
    return await backendAPI.get(`/exercises/${id}`);
}
export const getTestById = async (id) => {
    return await backendAPI.get(`/tests/${id}`);
}
export const updateTest = async (testId, testData) => {
    return await backendAPI.put(`/tests/${testId}`, testData);
}
export const login = async (data) => {
    return await backendAPI.post(`/auth/login`, data)
}
export const register = async (data) => {
    return await backendAPI.post(`/auth/register`, data)
}
    export const createTest = async (testCases, exerciseId) => {
        let inputData = {};
        let outputData = {};

        if (Array.isArray(testCases)) {
            testCases.forEach((tc) => {
                if (Array.isArray(tc.inputs)) {
                    tc.inputs.forEach((inp) => {
                        if (inp.varName && inp.value !== undefined) {
                            inputData[inp.varName] = {
                                value: inp.value,
                                type: inp.type || 'int'
                            };
                        }
                    });
                }
                if (Array.isArray(tc.outputs)) {
                    tc.outputs.forEach((out) => {
                        if (out.varName && out.value !== undefined) {
                            outputData[out.varName] = {
                                value: out.value,
                                type: out.type || 'int'
                            };
                        }
                    });
                }
            });
        }

        const payload = {
            inputData: inputData,
            outputData: outputData,
            exerciseId: exerciseId
        };

        return await backendAPI.post("/tests", payload);
    }
    export const deleteTest = async (id) => {
    return await backendAPI.delete(`/tests/${id}`);
    }
    export const getTests = async () => {
    return await backendAPI.get("/tests");
    }
    export const createSolutionExample = async (solutionExampleData) => {
        return await backendAPI.post("/solutionexamples", solutionExampleData);

    }
    export const deleteSolutionExample = async (id) => {
    return await backendAPI.delete(`/solutionexamples/${id}`);
    }
export const getSolutionExampleById = async (id) => {
    return await backendAPI.get(`/solutionexamples/${id}`);
}
export const getSolutionExamples = async () => {
    return await backendAPI.get("/solutionexamples");
}
export const updateSolutionExample = async (solutionExampleId, solutionExampleData) => {
    return await backendAPI.patch(`/solutionexamples/${solutionExampleId}`, solutionExampleData);
}
export const getMyProfile = async () => {
    return await backendAPI.get(`/profiles/me`)
}
export const getCourseProgress = async (id) => {
    return await backendAPI.get(`/courses/${id}/progress`)
}

// Check if a user is enrolled in a course
export const isUserEnrolled = async (userId, courseId) => {
    return await backendAPI.get(`/user/${userId}/courses/${courseId}/is-enrolled`);
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
export const getUserNotifications = async (userId, isRead) => {
    return await backendAPI.get(`/notifications/${userId}`, {params: {isRead}});
}
export const getUnreadNotificationsCount = async (userId) => {
    return await backendAPI.get(`/notifications/${userId}/count`);
}
export const sendNotification = async (notificationData) => {
    if (notificationData.userIds.length === 1) {
        notificationData.userId = notificationData.userIds[0];
        notificationData.userIds = [];
    }
    else {
        notificationData.userId = "00000000-0000-0000-0000-000000000000";
    }
    return await backendAPI.post(`/notifications/send`, notificationData);
}
export const markNotificationAsRead = async (notificationId) => {
    return await backendAPI.put(`/notifications/${notificationId}/read`, {});
}
export const markAllNotificationsAsRead = async (userId) => {
    return await backendAPI.put(`/notifications/read`, {userId});
}
export const updateUserTags = async (tags) => {
    return await backendAPI.put(`/profiles/me/interests`, {tags});
}
export const getAllTags = async () => {
    return await backendAPI.get(`/tags`);
}
export const getActiveChallenges = async () => {
    return await backendAPI.get(`/challenges/active`);
}
export const getChallengeById = async (id) => {
    return await backendAPI.get(`/challenges/${id}`);
}

export const getChallengeStatus = async (id) => {
    return await backendAPI.get(`/challenges/${id}/status`);
}

export const setChallengeStatus = async (id, isCompleted) => {
    return await backendAPI.patch(`/challenges/${id}/status`, { isCompleted });
}

export const submitExerciseSolution = async (exerciseId, code) => {
    return await backendAPI.post(`/exercises/${exerciseId}/attempt`, {codeSubmission: code});
}
export const completeLesson = async (id) => {
    return await backendAPI.post(`/lessons/${id}/complete`);
}
export const enrollInCourse = async (id) => {
    return await backendAPI.post(`/courses/${id}/enroll`);
}

export const isUserEnrolledInCourse = async (courseId) => {
    return await backendAPI.get(`/user/me/courses/${courseId}/is-enrolled`);
}