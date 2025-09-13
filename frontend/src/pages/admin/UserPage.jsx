import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "../../components/UserTable";
import axios from "axios";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // define fetchUsers as a function you can reuse
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const userInfo = localStorage.getItem("user");

      if (!token || !userInfo) {
        navigate("/login");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get("http://localhost:8001/api/get-user");

      const data = res.data;
      setUsers(data.data || []);
    } catch (err) {
      console.error("User fetch error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setError("Failed to load user list. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <UserTable 
      users={users}
      onReload={fetchUsers} // ✅ pass down fetchUsers as onReload
    />
  );
}
