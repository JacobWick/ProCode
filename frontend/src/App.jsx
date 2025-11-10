import { Routes, Route } from "react-router-dom";
import ExercisePage from "./pages/ExercisePage";
import HomePage from "./pages/HomePage";
import './index.css'
import CoursesPage from "./pages/CoursesPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";

function App() {
  return (
      <Routes>
          <Route path="/exercise" element={< ExercisePage/>} /> {/* will be changed later to dynamic route*/}
          <Route path="/" element={< HomePage/>} />
          <Route path="/courses" element={< CoursesPage/>} />
          <Route path="/courses/:id" element={<CourseDetailPage/>} />
      </Routes>
  );
}

export default App
