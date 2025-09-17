import axios from "axios";
import Modal from "./Modal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function DeleteForm({ isOpen, onClose, user, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8001/api/delete", {
        id: user.id,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
        </div>
        <p className="text-gray-700">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold">{user?.name}</span>? This action
          cannot be undone.
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </Modal>
  );
}
