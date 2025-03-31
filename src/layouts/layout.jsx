import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Menu, Home, Bell, LogOut, User, Settings } from "lucide-react";
import { Link, Outlet } from "react-router";
import { useStore } from "../stores/userStore";

function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, isAuthenticated, logout } = useStore();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      </div>

      {mobileSidebarOpen && (
        <div className="block md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleMobileSidebar}
          ></div>
          <div className="relative h-full w-64">
            <Sidebar collapsed={false} toggleSidebar={toggleMobileSidebar} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-primary text-primary-content shadow-md z-30">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                className="md:hidden btn btn-ghost btn-circle"
                onClick={toggleMobileSidebar}
                aria-label="Toggle mobile sidebar"
              >
                <Menu size={24} />
              </button>
              <Link to="/" className="text-xl font-bold hidden md:block">
                Challenge App
              </Link>
              <Link to="/" className="text-xl font-bold md:hidden">
                Challenge
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <button className="btn btn-ghost btn-circle" aria-label="Notifications">
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
                        {user?.profileImage && user.profileImage !== "" ? (
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
                      className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-neutral"
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
                      <li>
                        <Link to="#" onClick={(e) => { e.preventDefault(); logout(); }} className="flex items-center gap-2">
                          <LogOut size={16} />
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn btn-ghost">
                    Login
                  </Link>
                  <span className="text-primary-content opacity-50">|</span>
                  <Link to="/register" className="btn btn-ghost">
                    Register
                  </Link>
                </div>
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
