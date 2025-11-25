import {Routes, Route } from "react-router-dom";
import ExercisePage from "./pages/Learning/ExercisePage.jsx";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/Learning/CoursesPage.jsx";
import CourseDetailPage from "./pages/Learning/CourseDetailPage.jsx";
import LessonPage from "./pages/Learning/LessonPage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import RegisterPage from "./pages/Auth/RegisterPage.jsx";
import CreatePage from "./pages/Admin/Create/CreatePage.jsx";
import CreateCoursePage from "./pages/Admin/Create/CreateCoursePage.jsx";
import CreateExercisePage from "./pages/Admin/Create/CreateExercisePage.jsx";
import CreateLessonPage from "./pages/Admin/Create/CreateLessonPage.jsx";
import CreateTestPage from "./pages/Admin/Create/CreateTestPage.jsx";
import CreateSolutionPage from "./pages/Admin/Create/CreateSolutionPage.jsx";
import UserProfile from "./pages/Profile/UserProfile.jsx"
import AdminPanelPage from "./pages/Admin/AdminPanelPage.jsx";
import EditUserPage from "./pages/Admin/Edit/EditUserPage.jsx";
import CreateUserPage from "./pages/Admin/Create/CreateUserPage.jsx";
import EditProfile from "./pages/Admin/Edit/EditProfilePage.jsx";
import EditCoursePage from "./pages/Admin/Edit/EditCoursePage.jsx";
import MyCoursesPage from "./pages/Profile/MyCoursesPage.jsx";
import EditLessonPage from "./pages/Admin/Edit/EditLessonPage.jsx";
import EditExercisePage from "./pages/Admin/Edit/EditExercisePage.jsx";
import EditTestPage from "./pages/Admin/Edit/EditTestPage.jsx";
import EditSolutionExamplePage from "./pages/Admin/Edit/EditSolutionExamplePage.jsx";
import './index.css'
import NotificationsPage from "./pages/Profile/NotificationsPage.jsx";
import RoadmapPage from "./pages/RoadmapPage.jsx";

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
                <Route path="/edit-course/:courseId" element={<EditCoursePage/>} />
                <Route path="my-courses" element={<MyCoursesPage/>} />
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
                <Route path="/courses/recommended" element={<RoadmapPage/>}/>
                <Route path="/edit-lesson/:lessonId" element={<EditLessonPage/>}/>
                <Route path="/edit-exercise/:exerciseId" element={<EditExercisePage/>}/>
                <Route path="/edit-test/:testId" element={<EditTestPage/>}/>
                <Route path="/edit-solution/:solutionId" element={<EditSolutionExamplePage/>}/>
                <Route path="/notifications" element={<NotificationsPage />} />
            </Routes>
    );
}

export default App;
