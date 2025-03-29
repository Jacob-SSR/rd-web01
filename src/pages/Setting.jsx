import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, Key, Trash2, Save, Camera, AlertTriangle, Check, X } from 'lucide-react';
import { useStore } from '../stores/userStore';
import { updateUserProfile, updateUserPassword, deleteUserAccount } from '../api/exportAllApi';

function Setting() {
  const navigate = useNavigate();
  const { user, updateProfile, updatePassword, deleteAccount, logout } = useStore();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstname: '',
    lastname: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Initialize profile form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
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
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Submit profile form
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await updateProfile(profileForm, profileImage);
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Submit password form
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New passwords do not match'
      });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await updatePassword(
        passwordForm.oldPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );
      
      setMessage({
        type: 'success',
        text: 'Password updated successfully!'
      });
      
      // Reset password form
      setPasswordForm({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update password'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    setLoading(true);
    
    try {
      await deleteAccount();
      logout();
      navigate('/login');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to delete account'
      });
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <a 
          className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
          onClick={() => {
            setActiveTab('profile');
            setMessage({ type: '', text: '' });
          }}
        >
          <User size={18} className="mr-2" />
          Profile
        </a>
        
        <a 
          className={`tab ${activeTab === 'password' ? 'tab-active' : ''}`}
          onClick={() => {
            setActiveTab('password');
            setMessage({ type: '', text: '' });
          }}
        >
          <Key size={18} className="mr-2" />
          Password
        </a>
        
        <a 
          className={`tab ${activeTab === 'account' ? 'tab-active' : ''}`}
          onClick={() => {
            setActiveTab('account');
            setMessage({ type: '', text: '' });
          }}
        >
          <Trash2 size={18} className="mr-2" />
          Account
        </a>
      </div>
      
      {/* Alert Messages */}
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
          {message.type === 'success' ? (
            <Check size={18} className="stroke-current shrink-0" />
          ) : (
            <X size={18} className="stroke-current shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}
      
      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Edit Profile</h2>
            
            <form onSubmit={handleProfileSubmit}>
              {/* Profile Image */}
              <div className="form-control mb-6 flex flex-col items-center">
                <div className="avatar relative">
                  <div className="w-24 rounded-full">
                    {profileImagePreview ? (
                      <img
                        src={profileImagePreview}
                        alt="Profile Preview"
                      />
                    ) : (
                      <div className="bg-primary text-primary-content flex items-center justify-center h-full">
                        <span className="text-2xl">
                          {user?.firstname?.charAt(0) || user?.username?.charAt(0) || '?'}
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
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Save size={18} className="mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Password Settings */}
      {activeTab === 'password' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Change Password</h2>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Current Password</span>
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered"
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered"
                  required
                  minLength="6"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered"
                  required
                  minLength="6"
                />
              </div>
              
              <div className="card-actions justify-end mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <Key size={18} className="mr-2" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Account Settings */}
      {activeTab === 'account' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-error">Delete Account</h2>
            
            <div className="alert alert-warning mb-6">
              <AlertTriangle size={18} className="stroke-current shrink-0" />
              <span>Warning: This action is irreversible. All your data will be permanently deleted.</span>
            </div>
            
            {!showDeleteConfirm ? (
              <div className="card-actions justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn-error"
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete My Account
                </button>
              </div>
            ) : (
              <div className="card bg-base-200 p-4 rounded-lg">
                <h3 className="font-bold text-error mb-4">
                  Are you absolutely sure you want to delete your account?
                </h3>
                
                <div className="card-actions justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleDeleteAccount}
                    className={`btn btn-error ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <Trash2 size={18} className="mr-2" />
                    )}
                    Yes, Delete My Account
                  </button>
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