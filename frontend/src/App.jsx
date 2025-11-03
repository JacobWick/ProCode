import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExercisePage from "./pages/ExercisePage";
import CoursesPage from "./pages/CoursesPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/exercise" element={< ExercisePage/>} /> // will be changed later to dynamic route
          <Route path="/courses" element={< CoursesPage/>} />
          <Route path="/courses/:id" element={<CourseDetailPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
