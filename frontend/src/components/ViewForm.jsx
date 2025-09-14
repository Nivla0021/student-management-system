import Modal from "./Modal";

export default function ViewForm({ isOpen, onClose, user }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details">
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="text-sm text-gray-500">ID</p>
          <p className="text-lg font-semibold text-gray-800">{user?.id}</p>
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="text-sm text-gray-500">Role</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              user?.role === "admin"
                ? "bg-red-100 text-red-700"
                : user?.role === "teacher"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {user?.role}
          </span>
        </div>
      </div>
    </Modal>
  );
}
