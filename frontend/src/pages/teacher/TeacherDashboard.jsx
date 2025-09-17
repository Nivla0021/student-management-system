import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserGraduate } from "react-icons/fa";
import TeacherLayout from "../../layout/TeacherLayout";

export default function TeacherDashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [countsLoading, setCountsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchDashboardCounts();
  }, [navigate]);

  const fetchDashboardCounts = async () => {
    setCountsLoading(true);
    try {
      const resStudents = await axios.get(
        "http://localhost:8001/api/get-user?role=student"
      );
      setStudentCount(resStudents.data.data?.length || 0);
    } catch (err) {
      console.error("Error fetching counts:", err);
      setError("Failed to load dashboard stats.");
    } finally {
      setCountsLoading(false);
    }
  };

  return (
    <TeacherLayout title="Teacher Dashboard">
      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Students Card */}
          <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition duration-300 hover:shadow-xl hover:scale-105">
            {countsLoading ? (
              <div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <>
                <FaUserGraduate className="text-green-600 text-4xl mb-2" />
                <h3 className="text-lg font-semibold mb-2">Students</h3>
                <p className="text-3xl font-bold text-green-600">
                  {studentCount}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </TeacherLayout>
  );
}
