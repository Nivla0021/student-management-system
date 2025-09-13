import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // reset error

    try {
      const res = await axios.post("http://localhost:8001/api/login", {
        email,
        password,
      });

      const { token, user_info } = res.data;

      // Save token + user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user_info));

      // Set default Authorization header for all requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Redirect based on role (make sure you add role in your backend response)
      if (user_info.role === "admin") {
        navigate("/admin");
      } else if (user_info.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
