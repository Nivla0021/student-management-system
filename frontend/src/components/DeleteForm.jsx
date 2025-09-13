import axios from "axios";
import Modal from "./Modal";

export default function DeleteForm({ isOpen, onClose, user, onSuccess }) {
  const handleDelete = async () => {
    try {
      await axios.post('http://localhost:8001/api/delete',{
        id: user.id
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <p className="mb-4">
        Are you sure you want to delete <b>{user?.name}</b>?
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
