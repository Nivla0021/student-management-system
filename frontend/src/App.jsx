import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import { ToastContainer } from "react-toastify";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import UserPage from './pages/admin/UserPage'

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import StudentPage from './pages/teacher/StudentPage'

import StudentDashboard from "./pages/student/StudentDashboard";






function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/user-management" element={<UserPage />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/student-management" element={<StudentPage />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
