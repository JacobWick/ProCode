import { Routes, Route } from "react-router-dom";
import ExercisePage from "./pages/ExercisePage";
import HomePage from "./pages/HomePage";
import './index.css'

function App() {
  return (
      <Routes>
        <Route path="/exercise" element={< ExercisePage/>} /> {/* will be changed later to dynamic route*/}
        <Route path="/" element={< HomePage/>} />
      </Routes>
  );
}

export default App
