import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getCurrentUser, banUser, unbanUser } from '../../api/exportAllApi';

function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [showBanForm, setShowBanForm] = useState(false);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await getCurrentUser(); // Replace with actual API call when available
        setUser(response);
      } catch (err) {
        setError('Failed to load user details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, [userId]);

  const handleBanUser = async (e) => {
    e.preventDefault();
    if (!banReason.trim()) {
      setError('Please provide a reason for banning');
      return;
    }

    try {
      await banUser({
        userId,
        reason: banReason
      });
      // Refresh user data
      const updatedUser = { ...user, isBanned: true, banReason };
      setUser(updatedUser);
      setShowBanForm(false);
      setBanReason('');
    } catch (err) {
      setError('Failed to ban user');
      console.error(err);
    }
  };

  const handleUnbanUser = async () => {
    try {
      await unbanUser({ userId });
      // Refresh user data
      const updatedUser = { ...user, isBanned: false, banReason: null };
      setUser(updatedUser);
    } catch (err) {
      setError('Failed to unban user');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center m-4">
        <h2 className="text-xl font-bold">User not found</h2>
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">User Details</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={`${user.username}'s profile`} 
              className="w-16 h-16 rounded-full mr-4 object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
              <span className="text-xl text-gray-600">
                {user.username?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          
          {user.isBanned && (
            <div className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              Banned
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-medium text-gray-700">Full Name</h3>
            <p>{user.firstname} {user.lastname}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">User ID</h3>
            <p>{user.id}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Role</h3>
            <p className="capitalize">{user.role}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700">Joined On</h3>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        {user.isBanned && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <h3 className="font-medium text-red-800">Ban Information</h3>
            <p className="text-red-700 mt-1">Reason: {user.banReason}</p>
            <p className="text-red-700">Banned on: {new Date(user.bannedAt).toLocaleDateString()}</p>
          </div>
        )}
        
        <div className="flex justify-end">
          {user.isBanned ? (
            <button
              onClick={handleUnbanUser}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Unban User
            </button>
          ) : (
            <button
              onClick={() => setShowBanForm(true)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Ban User
            </button>
          )}
        </div>
      </div>
      
      {showBanForm && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Ban User</h2>
          <form onSubmit={handleBanUser}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="banReason">
                Reason for Ban
              </label>
              <textarea
                id="banReason"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Provide a reason for banning this user"
                rows="4"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowBanForm(false);
                  setBanReason('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Confirm Ban
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default UserDetails;