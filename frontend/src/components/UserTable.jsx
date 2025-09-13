import { useState, useMemo } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import UserForm from "./UserForm";
import ViewForm from "./ViewForm";
import EditForm from "./EditForm";
import DeleteForm from "./DeleteForm";

export default function UserTable({ users, onReload }) {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // "view" | "edit" | "delete" | "add"
  const itemsPerPage = 5;

  const filteredUsers = useMemo(() => {
    return filter === "all" ? users : users.filter((u) => u.role === filter);
  }, [users, filter]);

  const lastPage = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">User List</h2>

      {/* Filter */}
      <div className="flex items-center mb-4">
        <label className="mr-2 font-medium">Filter by Role:</label>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-3 py-2"
        >
          <option value="all">All</option>
          <option value="admin">Admins</option>
          <option value="teacher">Teachers</option>
          <option value="student">Students</option>
        </select>

        <button
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          onClick={() => setModalType("add")}
        >
          <FaPlus /> Add User
        </button>
      </div>

      {/* User table */}
      {paginatedUsers.length > 0 ? (
        <>
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">{u.id}</td>
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 capitalize">{u.role}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setModalType("view");
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setModalType("edit");
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(u);
                        setModalType("delete");
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page <b>{currentPage}</b> of {lastPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, lastPage))}
              disabled={currentPage === lastPage}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No users available.</p>
      )}

      {/* Modals */}
      {modalType === "add" && (
        <UserForm
          isOpen={true}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            onReload();
            setModalType(null);
          }}
        />
      )}
      {modalType === "view" && selectedUser && (
        <ViewForm
          isOpen={true}
          user={selectedUser}
          onClose={() => setModalType(null)}
        />
      )}
      {modalType === "edit" && selectedUser && (
        <EditForm
          isOpen={true}
          user={selectedUser}
          onSuccess={() => {
            setModalType(null);
            onReload();
          }}
          onClose={() => setModalType(null)}
        />
      )}
      {modalType === "delete" && selectedUser && (
        <DeleteForm
          isOpen={true}
          user={selectedUser}
          onSuccess={() => {
            setModalType(null);
            onReload();
          }}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}
