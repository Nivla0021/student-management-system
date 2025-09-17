import { useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validateUserForm } from "../utils/Validation"; // ✅ import

export default function UserForm({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ use shared validation
    const validationError = validateUserForm({ name, email, password, checkPassword: true });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8001/api/register", {
        name,
        email,
        role,
        password,
      });
      setName("");
      setEmail("");
      setRole("student");
      setPassword("");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);

      if (err.response && err.response.status === 422) {
        // Laravel validation errors
        const errors = err.response.data.errors;
        const messages = Object.values(errors).flat().join(" ");
        setError(messages);
      } else {
        setError("❌ Failed to create user. Please try again.");
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add User">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2 bg-red-100 text-red-600 rounded text-sm">
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded w-full px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full px-3 py-2"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded w-full px-3 py-2"
        >
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded w-full px-3 py-2 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            "Save"
          )}
        </button>
      </form>
    </Modal>
  );
}
