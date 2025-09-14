// src/pages/admin/AdminProfile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../../layout/AdminLayout";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";
import { validateUserForm } from "../../utils/Validation";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ toast state
  const [toast, setToast] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/profile");
      const user = res.data?.data_user ?? null;
      setAdmin(user);
      setName(user?.name ?? "");
      setEmail(user?.email ?? "");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const validationMessage = validateUserForm({ name, email });
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }
    setValidationError("");
    setSaving(true);

    try {
      await axios.post("http://localhost:8001/api/update", {
        id: admin.id,
        name,
        email,
      });

      const updated = { ...admin, name, email };
      setAdmin(updated);
      try {
        localStorage.setItem("user", JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not update localStorage user:", err);
      }

      setEditing(false);

      // ✅ show success toast
      setToast("Profile updated successfully!");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("⚠️ All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("⚠️ New password and confirm password do not match.");
      return;
    }

    setPasswordError("");
    setSavingPassword(true);

    try {
      await axios.post("http://localhost:8001/api/change-password", {
        id: admin.id,
        current_password: currentPassword,
        new_password: newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // ✅ show success toast
      setToast("Password changed successfully!");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordError("Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  const openEditor = () => {
    setValidationError("");
    setEditing(true);
  };
  const cancelEdit = () => {
    setValidationError("");
    setName(admin?.name ?? "");
    setEmail(admin?.email ?? "");
    setEditing(false);
  };

  return (
    <AdminLayout title="Profile">
      {/* ✅ Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-fade-in">
          <FaCheckCircle /> {toast}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
          {/* Profile Info */}
          <div className="flex items-center gap-4 mb-4">
            <FaUser className="text-blue-600 text-4xl" />
            <div>
              <h2 className="text-xl font-bold">{admin?.name}</h2>
              <p className="text-gray-600">{admin?.email}</p>
            </div>
          </div>

          {!editing ? (
            <>
              <div className="border-t pt-4 space-y-2">
                <p>
                  <span className="font-semibold">Role:</span> {admin?.role}
                </p>
                <p>
                  <span className="font-semibold">Joined:</span>{" "}
                  {admin?.created_at
                    ? new Date(admin.created_at).toLocaleDateString()
                    : "-"}
                </p>
              </div>

              <button
                onClick={openEditor}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 cursor-pointer"
              >
                <FaEdit /> Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              {validationError && (
                <div className="p-2 bg-red-100 text-red-600 rounded text-sm">
                  {validationError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded w-full px-3 py-2"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-green-700 cursor-pointer ${
                    saving ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-400 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-500 cursor-pointer"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          )}

          {/* Change Password Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
              <FaLock /> Change Password
            </h3>

            {passwordError && (
              <div className="p-2 bg-red-100 text-red-600 rounded text-sm mb-2">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border rounded w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border rounded w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border rounded w-full px-3 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className={`w-full bg-purple-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-purple-700 cursor-pointer ${
                  savingPassword ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {savingPassword ? (
                  <>
                    <FaSpinner className="animate-spin" /> Changing...
                  </>
                ) : (
                  <>
                    <FaSave /> Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
