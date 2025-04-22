import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Key,
  Trash2,
  Save,
  Camera,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { useStore } from "../stores/userStore"; // Changed to use { useStore } instead of default import
import {
  updateUserProfile,
  updateUserPassword,
  deleteUserAccount,
} from "../api/exportAllApi";

function Setting() {
  const navigate = useNavigate();
  const { user, logout } = useStore(); // Remove functions that don't exist in your store

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstname: "",
    lastname: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize profile form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
      });

      if (user.profileImage) {
        setProfileImagePreview(user.profileImage);
      }
    }
  }, [user]);

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit profile form - Updated to use the API directly
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Create FormData for the API call
      const formData = new FormData();
      formData.append('firstname', profileForm.firstname);
      formData.append('lastname', profileForm.lastname);
      
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      // Use the imported API function directly
      const response = await updateUserProfile(formData);
      
      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit password form - Updated to use the API directly
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Use the imported API function directly
      await updateUserPassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      setMessage({
        type: "success",
        text: "Password updated successfully!",
      });

      // Reset password form
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion - Updated to use the API directly
  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      await deleteUserAccount();
      logout(); // This function should still be available in your store
      navigate("/login");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to delete account",
      });
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <button
          className={`tab ${activeTab === "profile" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("profile");
            setMessage({ type: "", text: "" });
          }}
        >
          <User size={18} className="mr-2" />
          Profile
        </button>

        <button
          className={`tab ${activeTab === "password" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("password");
            setMessage({ type: "", text: "" });
          }}
        >
          <Key size={18} className="mr-2" />
          Password
        </button>

        <button
          className={`tab ${activeTab === "account" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("account");
            setMessage({ type: "", text: "" });
          }}
        >
          <Trash2 size={18} className="mr-2" />
          Account
        </button>
      </div>

      {/* Alert Messages */}
      {message.text && (
        <div
          className={`alert ${
            message.type === "success" ? "alert-success" : "alert-error"
          } mb-6`}
        >
          {message.type === "success" ? (
            <Check size={18} className="stroke-current shrink-0" />
          ) : (
            <X size={18} className="stroke-current shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Edit Profile</h2>

            <form onSubmit={handleProfileSubmit}>
              {/* Profile Image */}
              <div className="form-control mb-6 flex flex-col items-center">
                <div className="avatar relative">
                  <div className="w-24 rounded-full">
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="Profile Preview" />
                    ) : (
                      <div className="bg-primary text-primary-content flex items-center justify-center h-full">
                        <span className="text-2xl">
                          {user?.firstname?.charAt(0) ||
                            user?.username?.charAt(0) ||
                            "?"}
                        </span>
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profileImage"
                    className="btn btn-circle btn-sm btn-primary absolute bottom-0 right-0"
                  >
                    <Camera size={16} />
                  </label>
                </div>

                <input
                  type="file"
                  id="profileImage"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={profileForm.firstname}
                    onChange={handleProfileChange}
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={profileForm.lastname}
                    onChange={handleProfileChange}
                    className="input input-bordered"
                  />
                </div>
              </div>

              <div className="card-actions justify-end">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Settings */}
      {activeTab === "password" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Change Password</h2>

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Old Password</span>
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="card-actions justify-end">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Deletion */}
      {activeTab === "account" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Delete Account</h2>

            <p className="mb-4 text-red-500">
              This action is irreversible. Are you sure you want to delete your
              account?
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-error"
              >
                Delete Account
              </button>
            </div>

            {/* Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <h2 className="text-xl font-semibold">Confirm Deletion</h2>
                  <p className="mb-4 text-red-500">
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn btn-secondary mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="btn btn-error"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Setting;
