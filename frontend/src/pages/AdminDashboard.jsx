import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchUsers(page = 1) {
      try {
        const token = localStorage.getItem("token");
        const userInfo = localStorage.getItem("user");

        if (!token || !userInfo) {
          navigate("/login");
          return;
        }

        setAdmin(JSON.parse(userInfo));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // pass ?page=<number>
        const res = await axios.get(
          `http://localhost:8001/api/get-user?page=${page}`
        );

        if (!mounted) return;

        const data = res.data.data_user_list;
        setUsers(data.data || []);
        setCurrentPage(data.current_page);
        setLastPage(data.last_page);
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
        if (mounted) setLoading(false);
      }
    }

    fetchUsers(currentPage);
    return () => {
      mounted = false;
    };
  }, [currentPage, navigate]);

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
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Admin's own profile */}
      {admin && (
        <div style={{ marginBottom: "20px" }}>
          <h2>My Profile</h2>
          <table border="1" cellPadding="8">
            <tbody>
              <tr>
                <td><strong>ID</strong></td>
                <td>{admin.id}</td>
              </tr>
              <tr>
                <td><strong>Name</strong></td>
                <td>{admin.name}</td>
              </tr>
              <tr>
                <td><strong>Email</strong></td>
                <td>{admin.email}</td>
              </tr>
              <tr>
                <td><strong>Role</strong></td>
                <td>{admin.role}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* User list */}
      <h2>User List</h2>
      {users.length > 0 ? (
        <>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {lastPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, lastPage))}
              disabled={currentPage === lastPage}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No users available.</p>
      )}

      <button style={{ marginTop: "20px" }} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
