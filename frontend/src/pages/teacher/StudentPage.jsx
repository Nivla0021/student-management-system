import TeacherLayout from "../../layout/TeacherLayout";
import StudentTable from "../../components/teacher/StudentTable";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

export default function StudentPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"+token));
  const role = currentUser?.role;

  
  const fetchUsers = useCallback(async () => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await axios.get("http://localhost:8001/api/get-user?role=student");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("User fetch error:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <TeacherLayout title="Student Management">
      {loading ? (
        <div className="space-y-6">
          {/* Spinner */}
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-blue-600 text-3xl" />
          </div>

          {/* Skeleton Table */}
          <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-5 gap-4 items-center"
                >
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-5 bg-gray-200 rounded"></div>
                  <div className="h-5 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <StudentTable 
          users={users}
          onReload={fetchUsers}
          userRole={role}
          token={token}
          />
      )}
    </TeacherLayout>
  );
}
