import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExercisePage from "./pages/ExercisePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/exercise" element={< ExercisePage/>} /> // will be changed later to dynamic route
      </Routes>
    </BrowserRouter>
  );
}

export default App
