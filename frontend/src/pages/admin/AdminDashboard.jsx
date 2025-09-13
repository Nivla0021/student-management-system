import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import axios from "axios";
import {
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // initial dashboard loading
  const [countsLoading, setCountsLoading] = useState(true); // NEW: for cards
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");

    if (!token || !userInfo) {
      navigate("/login");
      return;
    }

    setAdmin(JSON.parse(userInfo));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    fetchDashboardCounts();

    setLoading(false);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "http://localhost:8001/api/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      setTimeout(() => {
        setLogoutLoading(false);
        navigate("/login");
      }, 800);
    }
  };

  const fetchDashboardCounts = async () => {
    setCountsLoading(true);
    try {
      const resTeachers = await axios.get(
        "http://localhost:8001/api/get-user?role=teacher"
      );
      const resStudents = await axios.get(
        "http://localhost:8001/api/get-user?role=student"
      );
      setTeacherCount(resTeachers.data.data?.length || 0);
      setStudentCount(resStudents.data.data?.length || 0);
    } catch (err) {
      console.error("Error fetching counts:", err);
    } finally {
      setCountsLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="flex h-screen font-sans relative">
      {/* Logout Overlay Loader */}
      {logoutLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

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
              alt="School Logo"
              className={`w-10 h-10 rounded-full ${!sidebarOpen && "mx-auto"}`}
            />
            {sidebarOpen && <span className="text-xl font-bold">Lambingan</span>}
          </div>
          <button
            className="text-white focus:outline-none cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
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

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white shadow-md px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-700">Admin Dashboard</h1>

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

        {/* Dashboard cards */}
        <main className="flex-1 p-6 bg-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Teachers Card */}
            <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition duration-300 hover:shadow-xl hover:scale-105">
              {countsLoading ? (
                <div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <FaChalkboardTeacher className="text-indigo-600 text-4xl mb-2" />
                  <h3 className="text-lg font-semibold mb-2">Teachers</h3>
                  <p className="text-3xl font-bold text-indigo-600">{teacherCount}</p>
                </>
              )}
            </div>

            {/* Students Card */}
            <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition duration-300 hover:shadow-xl hover:scale-105">
              {countsLoading ? (
                <div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <FaUserGraduate className="text-green-600 text-4xl mb-2" />
                  <h3 className="text-lg font-semibold mb-2">Students</h3>
                  <p className="text-3xl font-bold text-green-600">{studentCount}</p>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
