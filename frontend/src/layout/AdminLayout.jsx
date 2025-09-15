// src/layout/AdminLayout.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaBars, FaUser, FaSignOutAlt, FaChalkboardTeacher } from "react-icons/fa";
import axios from "axios";

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load initial user
    const userInfo = localStorage.getItem("user");
    if (userInfo) setAdmin(JSON.parse(userInfo));

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    // ✅ Listen for custom user update event
    const handleUserUpdate = (e) => {
      setAdmin(e.detail);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("userUpdated", handleUserUpdate);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
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
      localStorage.removeItem("user");
      navigate("/login");
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
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            <FaChalkboardTeacher />
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          <button
            onClick={() => navigate("/admin/user-management")}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-600 transition-colors cursor-pointer"
          >
            <FaUser />
            {sidebarOpen && <span>Manage Users</span>}
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
              <span>{admin?.name}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <button
                  onClick={() => navigate("/admin/profile")}
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
    </div>
  );
}
