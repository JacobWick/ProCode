import {Routes, Route } from "react-router-dom";
import ExercisePage from "./pages/ExercisePage";
import HomePage from "./pages/HomePage";
import './index.css'
import CoursesPage from "./pages/CoursesPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import LessonPage from "./pages/LessonPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import CreateCoursePage from "./pages/CreateCoursePage.jsx";
import CreateExercisePage from "./pages/CreateExercisePage.jsx";
import CreateLessonPage from "./pages/CreateLessonPage.jsx";
import CreateTestPage from "./pages/CreateTestPage.jsx";
import CreateSolutionPage from "./pages/CreateSolutionPage.jsx";


function App() {
    return (
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/exercise" element={<ExercisePage/>} />
                <Route path="/courses" element={<CoursesPage/>} />
                <Route path="/courses/:id" element={<CourseDetailPage/>} />
                <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
                <Route path="/courses/:courseId/lessons/:lessonId/exercises/:exerciseId" element={<ExercisePage />} />
                <Route path="/create" element={<CreatePage/>}/>
                <Route path="/create-course" element={<CreateCoursePage/>}/>
                <Route path="/create-lesson" element={<CreateLessonPage/>}/>
                <Route path="/create-exercise" element={<CreateExercisePage/>}/>
                <Route path="/create-test" element={<CreateTestPage/>}/>
                <Route path="/create-solution" element={<CreateSolutionPage/>}/>
            </Routes>
    );
}

export default App;
