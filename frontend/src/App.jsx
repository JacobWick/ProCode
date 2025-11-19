import {Routes, Route } from "react-router-dom";
import ExercisePage from "./pages/ExercisePage";
import HomePage from "./pages/HomePage";
import './index.css'
import CoursesPage from "./pages/CoursesPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import LessonPage from "./pages/LessonPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";
import CreateCoursePage from "./pages/CreateCoursePage.jsx";
import CreateExercisePage from "./pages/CreateExercisePage.jsx";
import CreateLessonPage from "./pages/CreateLessonPage.jsx";
import CreateTestPage from "./pages/CreateTestPage.jsx";
import CreateSolutionPage from "./pages/CreateSolutionPage.jsx";
import UserProfile from "./pages/UserProfile.jsx"
import AdminPanelPage from "./pages/AdminPanelPage.jsx";
import EditUserPage from "./pages/EditUserPage.jsx";
import CreateUserPage from "./pages/CreateUserPage.jsx";
import EditProfile from "./pages/EditProfilePage.jsx";


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
                <Route path="/create" element={<CreatePage/>}/>
                <Route path="/create-course" element={<CreateCoursePage/>}/>
                <Route path="/create-lesson" element={<CreateLessonPage/>}/>
                <Route path="/create-exercise" element={<CreateExercisePage/>}/>
                <Route path="/create-test" element={<CreateTestPage/>}/>
                <Route path="/create-solution" element={<CreateSolutionPage/>}/>
                <Route path="/my-profile" element={<UserProfile/>}/>
                <Route path="/my-profile/edit" element={<EditProfile/>}/>
                <Route path="/administrator" element={<AdminPanelPage/>}/>
                <Route path="/administrator/users/:userId/edit" element={<EditUserPage/>}/>
                <Route path="/administrator/users/create" element={<CreateUserPage/>}/>
            </Routes>
    );
}

export default App;
