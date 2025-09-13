import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import  PasswordInput  from '../../components/PasswordInput'
import logo from "../../assets/logo.png"; // adjust path

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // track loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8001/api/login", {
        email,
        password,
      });

      const { token, user_info } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user_info));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 to-indigo-700 font-poppins">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg py-4 px-6 flex items-center justify-center md:justify-start">
        <img src={logo} alt="School Logo" className="h-12 w-12 mr-3 rounded-full border-2 border-white shadow-md" />
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
          LAMBINGAN NATIONAL HIGHSCHOOL
        </h1>
      </header>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500">Login to continue to your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <PasswordInput
              password={password}
              setPassword={setPassword}
            />

            {error && (
              <div className="text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center bg-indigo-600 text-white py-2 px-4 rounded-lg 
                hover:bg-indigo-700 active:bg-indigo-800 
                transition duration-200 ease-in-out cursor-pointer shadow-md 
                ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"
                  />
                </svg>
              ) : null}
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          {/* <div className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:underline">
              Sign up
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}
