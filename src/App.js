

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UniversityManagementSystem from "./components/UniversityManagementSystem";
import Courses from "./components/course"; // Courses page ka component
import UserForm from "./components/UserForm";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="UniversityManagementSystem" element={<UniversityManagementSystem />} />
        <Route path="UserForm" element={<UserForm />} />
        <Route path="/" element={<Courses />} />
      </Routes>
    </Router>
  );
}

export default App;
