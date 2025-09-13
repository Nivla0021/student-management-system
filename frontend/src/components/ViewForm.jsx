import Modal from "./Modal";

export default function ViewForm({ isOpen, onClose, user }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details">
      <div className="space-y-2">
        <p><b>ID:</b> {user?.id}</p>
        <p><b>Name:</b> {user?.name}</p>
        <p><b>Email:</b> {user?.email}</p>
        <p><b>Role:</b> {user?.role}</p>
      </div>
    </Modal>
  );
}
