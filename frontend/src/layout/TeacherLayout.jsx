// src/layout/AdminLayout.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaBars, FaUser, FaSignOutAlt, FaChalkboardTeacher } from "react-icons/fa";
import axios from "axios";

export default function TeacherLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false); // ✅ loading screen state
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Load initial user
    const userInfo = localStorage.getItem("user"+token);
    if (userInfo) setTeacher(JSON.parse(userInfo));

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    // ✅ Listen for custom user update event
    const handleUserUpdate = (e) => {
      setTeacher(e.detail);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("userUpdated", handleUserUpdate);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true); // ✅ show loading screen
    try {
      
      if (token) {
        await axios.post(
          "http://localhost:8001/api/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user"+token);

      // ⏳ small delay so animation is visible
      setTimeout(() => {
        setLoggingOut(false);
        navigate("/login");
      }, 1200);
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-indigo-700 to-indigo-900 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className={`w-10 h-10 rounded-full ${!sidebarOpen && "mx-auto"}`}
            />
            {sidebarOpen && <span className="text-xl font-bold">Lambingan</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white focus:outline-none cursor-pointer"
          >
            <FaBars />
          </button>
        </div>

        <nav className="flex flex-col mt-6 gap-2 px-2">
          <button
            onClick={() => navigate("/teacher")}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            <FaChalkboardTeacher />
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          <button
            onClick={() => navigate("/teacher/student-management")}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            <FaUser />
            {sidebarOpen && <span>Manage Students</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow-md px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-700">{title}</h1>

          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <span>{teacher?.name}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <button
                  onClick={() => navigate("/teacher/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  <FaUser /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600 cursor-pointer"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page-specific content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
      </div>

      {/* ✅ Fullscreen Loading Overlay */}
      {loggingOut && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-10 w-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="text-white font-semibold text-lg">Logging out...</span>
          </div>
        </div>
      )}
    </div>
  );
}
