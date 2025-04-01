import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, User, Settings, LogOut, X, Trophy } from 'lucide-react';
import { useStore } from '../stores/userStore';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar({ children }) {
  const { user, isAuthenticated, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const closeProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  const mobileMenuVariants = {
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
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <div className="navbar bg-primary text-primary-content">
        <div className="navbar-start">
          {/* Mobile Menu Burger Button */}
          <button 
            className="btn btn-ghost lg:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="btn btn-ghost text-xl">Challenge App</Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/challenge">Challenge</Link></li>
          </ul>
        </div>
        
        {/* Right Side Navigation */}
        <div className="navbar-end">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <button className="btn btn-ghost btn-circle mr-2">
                <div className="indicator">
                  <Bell size={20} />
                </div>
              </button>
              
              {/* Profile Dropdown */}
              <div className="dropdown dropdown-end">
                <div 
                  tabIndex={0} 
                  role="button" 
                  className="btn btn-ghost btn-circle avatar"
                  onClick={toggleProfileDropdown}
                >
                  <div className="w-10 rounded-full">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={`${user.username || 'User'}'s profile`}
                      />
                    ) : (
                      <div className="bg-primary-content text-primary flex items-center justify-center h-full">
                        {user?.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                </div>
                {profileDropdownOpen && (
                  <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-neutral ">
                    <li>
                      <Link to="/profile" onClick={closeProfileDropdown}>
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          Profile
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" onClick={closeProfileDropdown}>
                        <div className="flex items-center gap-2">
                          <Settings size={16} />
                          Settings
                        </div>
                      </Link>
                    </li>
                    <li>
                      <button onClick={() => {
                        closeProfileDropdown();
                        logout();
                      }}>
                        <div className="flex items-center gap-2">
                          <LogOut size={16} />
                          Logout
                        </div>
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <span className="text-primary-content opacity-50">|</span>
              <Link to="/register" className="btn btn-ghost">Register</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              className="fixed inset-0 bg-black z-40 lg:hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div 
              className="fixed top-0 left-0 h-screen w-64 
              bg-primary text-primary-content z-50 lg:hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
            >
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 z-50"
                onClick={closeMobileMenu}
              >
                <X className="text-white" />
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
              </div>

              {/* Mobile Menu Items */}
              <div className="menu menu-lg p-4 text-white space-y-2">
                <div 
                  className="flex items-center gap-3 p-2 hover:bg-primary-focus rounded"
                  onClick={closeMobileMenu}
                >
                  <User size={20} />
                  <Link to="/profile" className="flex-1">Profile</Link>
                </div>
                <div 
                  className="flex items-center gap-3 p-2 hover:bg-primary-focus rounded"
                  onClick={closeMobileMenu}
                >
                  <Settings size={20} />
                  <Link to="/settings" className="flex-1">Settings</Link>
                </div>
                <div 
                  className="flex items-center gap-3 p-2 hover:bg-primary-focus rounded"
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Content - Children (AppRoutes) will render here */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default Navbar;