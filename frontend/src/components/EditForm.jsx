import { useState } from "react";
import axios from "axios";
import Modal from "./Modal";

export default function EditForm({ isOpen, onClose, user, onSuccess }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "student");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8001/api/update', {
        id: user.id,
        name,
        email,
        role,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border rounded w-full px-3 py-2"
        >
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update
        </button>
      </form>
    </Modal>
  );
}
