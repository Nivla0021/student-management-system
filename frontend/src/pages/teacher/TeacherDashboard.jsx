import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:8001/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!mounted) return;

        setTeacher(res.data.data_user);
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          setError("Failed to load profile. Please try again.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
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
      navigate("/login");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      {teacher ? (
        <div>
          <p><strong>ID:</strong> {teacher.id}</p>
          <p><strong>Name:</strong> {teacher.name}</p>
          <p><strong>Email:</strong> {teacher.email}</p>
          <p><strong>Role:</strong> {teacher.role}</p>

          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
}
