import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExercisePage from "./pages/ExercisePage";
import CoursesPage from "./pages/CoursesPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import LessonPage from "./pages/LessonPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/exercise" element={<ExercisePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:id" element={<CourseDetailPage />} />
                <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
