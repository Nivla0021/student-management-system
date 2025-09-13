import { useState } from "react";
import axios from "axios";
import Modal from "./Modal";

export default function UserForm({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add User">
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </Modal>
  );
}
