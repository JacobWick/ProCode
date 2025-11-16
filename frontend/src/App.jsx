import {Routes, Route } from "react-router-dom";
import ExercisePage from "./pages/ExercisePage";
import HomePage from "./pages/HomePage";
import './index.css'
import CoursesPage from "./pages/CoursesPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import LessonPage from "./pages/LessonPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
    return (
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/exercise" element={<ExercisePage/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<RegisterPage/>} />
                <Route path="/courses" element={<CoursesPage/>} />
                <Route path="/courses/:id" element={<CourseDetailPage/>} />
                <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
                <Route path="/courses/:courseId/lessons/:lessonId/exercises/:exerciseId" element={<ExercisePage />} />
            </Routes>
    );
}

export default App;
