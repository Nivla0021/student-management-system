import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");

    if (!token || !userInfo) {
      navigate("/login");
      return;
    }

    setAdmin(JSON.parse(userInfo));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setLoading(false);
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
      delete axios.defaults.headers.common["Authorization"];
      navigate("/login");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Admin Dashboard
      </h1>

      {/* Admin Profile Card */}
      {admin && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            maxWidth: "400px",
            background: "#f9f9f9",
          }}
        >
          <h2 style={{ marginBottom: "10px" }}>My Profile</h2>
          <p><strong>ID:</strong> {admin.id}</p>
          <p><strong>Name:</strong> {admin.name}</p>
          <p><strong>Email:</strong> {admin.email}</p>
          <p><strong>Role:</strong> {admin.role}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => navigate("/admin/user-management")}
          style={{
            padding: "10px 15px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ➕ Add Users
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 15px",
            background: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
