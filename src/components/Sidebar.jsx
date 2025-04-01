import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../stores/userStore';
import { 
  Home, 
  Trophy, 
  Calendar, 
  Users, 
  User, 
  Settings, 
  Award, 
  LogOut, 
  Menu, 
  X, 
  Shield 
} from 'lucide-react';

function Sidebar() {
  const { user, logout } = useStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check if a route is active
  const isActive = (path) => location.pathname === path;

  const sidebarVariants = {
    hidden: { 
      x: "-100%",
      transition: {
        type: "tween",
        duration: 0.3
      }
    },
    visible: { 
      x: 0,
      transition: {
        type: "tween",
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    hidden: { 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    visible: { 
      opacity: 0.5,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* Burger Menu Button (Always Visible) */}
      <div className="fixed top-4 left-4 z-50">
        <button 
          className="p-2"
          onClick={toggleSidebar}
        >
          <Menu className="text-white hover:cursor-pointer" />
        </button>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              className="fixed inset-0 bg-black z-40"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <motion.div 
              className="fixed top-0 left-0 h-screen w-64 
              bg-primary text-primary-content z-50"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sidebarVariants}
            >
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 z-50"
                onClick={toggleSidebar}
              >
                <X className="text-white hover:cursor-pointer" />
              </button>

              <div className="p-4 flex flex-col items-center border-b border-primary-focus mt-12">
                {/* Avatar */}
                <div className="avatar">
                  <div className="w-16 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2 mb-2">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" />
                    ) : (
                      <div className="bg-primary-content text-primary flex items-center justify-center h-full text-xl font-bold">
                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-lg mt-2">{user?.username || 'User'}</h3>
                <p className="text-xs opacity-70 mb-2">Level {user?.level || 1}</p>

                {/* XP Bar */}
                <div className="w-full">
                  <div className="flex justify-between text-xs mb-1">
                    <span>XP</span>
                    <span>{user?.experience || 0}/100</span>
                  </div>
                  <progress 
                    className="progress progress-accent w-full h-2" 
                    value={user?.experience || 0} 
                    max="100"
                  ></progress>
                </div>
              </div>

              {/* Main Menu */}
              <div className="flex-1 overflow-y-auto py-4">
                <ul className="menu menu-md px-2">
                  <li>
                    <Link 
                      to="/profile" 
                      className={isActive('/profile') ? 'active bg-primary-focus' : ''}
                      onClick={toggleSidebar}
                    >
                      <User size={20} />
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/challenge" 
                      className={isActive('/challenge') ? 'active bg-primary-focus' : ''}
                      onClick={toggleSidebar}
                    >
                      <Trophy size={20} />
                      <span>Challenges</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/daily-challenge" 
                      className={isActive('/daily-challenge') ? 'active bg-primary-focus' : ''}
                      onClick={toggleSidebar}
                    >
                      <Calendar size={20} />
                      <span>Daily Challenge</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/my-challenges" 
                      className={isActive('/my-challenges') ? 'active bg-primary-focus' : ''}
                      onClick={toggleSidebar}
                    >
                      <Users size={20} />
                      <span>My Challenges</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/settings" 
                      className={isActive('/settings') ? 'active bg-primary-focus' : ''}
                      onClick={toggleSidebar}
                    >
                      <Settings size={20} />
                      <span>Settings</span>
                    </Link>
                  </li>
                  {user?.role === 'ADMIN' && (
                    <li>
                      <Link 
                        to="/admin/dashboard" 
                        className={isActive('/admin/dashboard') ? 'active bg-primary-focus' : ''}
                        onClick={toggleSidebar}
                      >
                        <Shield size={20} />
                        <span>Admin</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              {/* Badges */}
              <div className="p-4 border-t border-primary-focus">
                <h4 className="text-sm font-medium mb-3">Badges</h4>
                <div className="flex justify-center space-x-2">
                  {user?.badges?.length > 0 ? (
                    user.badges.slice(0, 3).map((badge, index) => (
                      <div key={index} className="avatar">
                        <div className="w-10 rounded-full ring ring-accent ring-offset-1">
                          {badge.icon ? (
                            <img src={badge.icon} alt={badge.name} />
                          ) : (
                            <div className="bg-accent text-accent-content flex items-center justify-center">
                              <Award size={16} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    Array(3).fill(0).map((_, index) => (
                      <div key={index} className="avatar placeholder">
                        <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                          <span className="text-xs"><Award size={16} /></span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Logout */}
              <div className="p-4 border-t border-primary-focus">
                <button 
                  onClick={logout} 
                  className="btn btn-block btn-outline text-primary-content hover:bg-primary-focus hover:text-primary-content"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;