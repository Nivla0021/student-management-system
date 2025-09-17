import { useState, useMemo } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import UserForm from "../admin/UserForm";
import ViewForm from "../admin/ViewForm";
import EditForm from "../admin/EditForm";
import DeleteForm from "../admin/DeleteForm";

export default function StudentTable({ users, onReload, userRole, token }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // "view" | "edit" | "delete" | "add"
  const itemsPerPage = 5;

  // Apply search filter (no role filter anymore)
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const lower = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.id.toString().includes(lower) || // search by ID
        u.name.toLowerCase().includes(lower) // search by Name
    );
  }, [users, searchTerm]);

  const lastPage = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const showToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Title + Count */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👥 Student List</h2>
        <span className="text-gray-600 text-sm">
          Showing <b>{filteredUsers.length}</b> of <b>{users.length}</b> students
        </span>
      </div>

      {/* Controls: Search + Add */}
      <div className="flex flex-wrap items-center mb-6 gap-4 w-full">
        {/* Search */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1 max-w-xs bg-gray-50">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by ID or Name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={() => setModalType("add")}
          className="ml-auto flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 active:scale-95 transition cursor-pointer"
        >
          <FaPlus className="text-sm" /> Add Student
        </button>
      </div>

      {/* Student Table */}
      {paginatedUsers.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-700">{u.id}</td>
                    <td className="px-4 py-3 text-gray-700">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 capitalize text-gray-700">{u.role}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setModalType("view");
                        }}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setModalType("edit");
                        }}
                        className="text-yellow-500 hover:text-yellow-700 cursor-pointer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setModalType("delete");
                        }}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-4 text-gray-700">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <span className="text-sm">
              Page <b>{currentPage}</b> of {lastPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, lastPage))}
              disabled={currentPage === lastPage}
              className="px-4 py-2 border rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center py-6 italic">No students found.</p>
      )}

      {/* Modals */}
      {modalType === "add" && (
        <UserForm
          isOpen={true}
          onClose={() => setModalType(null)}
          onSuccess={() => {
            onReload();
            showToast("✅ User added successfully!");
            setModalType(null);
          }}
          userRole={userRole}
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
            showToast("✏️ User updated successfully!");
          }}
          onClose={() => setModalType(null)}
          userRole={userRole}
          token={token}
        />
      )}
      {modalType === "delete" && selectedUser && (
        <DeleteForm
          isOpen={true}
          user={selectedUser}
          onSuccess={() => {
            setModalType(null);
            onReload();
            showToast("🗑️ User deleted successfully!");
          }}
          onClose={() => setModalType(null)}
          token={token}
        />
      )}
    </div>
  );
}
