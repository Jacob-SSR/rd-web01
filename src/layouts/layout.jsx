import React from "react";
import Sidebar from "../components/Sidebar";
import { Bell, User, Settings, LogOut } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../stores/userStore";

function Layout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar is now always shown as a toggle menu */}
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-primary text-primary-content shadow-md z-30">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="text-xl font-bold">
                Challenge App
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <>
                  <button
                    className="btn btn-ghost btn-circle"
                    aria-label="Notifications"
                  >
                    <div className="indicator">
                      <Bell size={20} />
                    </div>
                  </button>

                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-ghost btn-circle avatar"
                    >
                      <div className="w-10 rounded-full">
                        {user?.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={`${user?.username || "User"}'s profile`}
                          />
                        ) : (
                          <div className="bg-primary-content text-primary flex items-center justify-center h-full">
                            {user?.username?.charAt(0)?.toUpperCase() || "A"}
                          </div>
                        )}
                      </div>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <Link to="/profile" className="justify-between">
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            Profile
                          </div>
                        </Link>
                      </li>
                      <li>
                        <Link to="/settings" className="justify-between">
                          <div className="flex items-center gap-2">
                            <Settings size={16} />
                            Settings
                          </div>
                        </Link>
                      </li>
                      {user?.role === 'ADMIN' && (
                        <li>
                          <Link to="/admin/dashboard" className="justify-between">
                            <div className="flex items-center gap-2">
                              <User size={16} />
                              Admin Dashboard
                            </div>
                          </Link>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;