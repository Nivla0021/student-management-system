import { useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import { validateUserForm } from "../../utils/Validation"; // ✅ import

export default function EditForm({ isOpen, onClose, user, onSuccess, userRole }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ use shared validation (no password required here)
    const validationError = validateUserForm({ name, email });
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8001/api/update", {
        id: user.id,
        name,
        email,
        role,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to update user. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2 bg-red-100 text-red-600 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded w-full px-3 py-2"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded w-full px-3 py-2"
        />

        {/* ✅ Only show role dropdown if logged-in user is an admin */}
        {userRole === "admin" && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded w-full px-3 py-2"
          >
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            "Update"
          )}
        </button>
      </form>
    </Modal>
  );
}
