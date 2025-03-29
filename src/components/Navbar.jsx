import React, { useState } from 'react';
import { Link } from 'react-router';
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react';
import { useStore } from '../stores/userStore';

function Navbar({ children }) {
  const { user, isAuthenticated, logout } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <div className="navbar bg-primary text-primary-content">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={toggleMenu}>
              <Menu size={24} />
            </div>
            {menuOpen && (
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-primary rounded-box w-52">
                <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
                <li><Link to="/challenge" onClick={() => setMenuOpen(false)}>Challenge</Link></li>
                {isAuthenticated && (
                  <li><Link to="/settings" onClick={() => setMenuOpen(false)}>Settings</Link></li>
                )}
              </ul>
            )}
          </div>
          <Link to="/" className="btn btn-ghost text-xl">Logo</Link>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/challenge">Challenge</Link></li>
          </ul>
        </div>
        
        <div className="navbar-end">
          {isAuthenticated ? (
            <>
              <button className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <Bell size={20} />
                  {/* Optional notification badge */}
                  {/* <span className="badge badge-xs badge-primary indicator-item">2</span> */}
                </div>
              </button>
              
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
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
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-neutral">
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
                    <button onClick={logout} className="flex items-center gap-2">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
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
      
      {/* Main Content - Children (AppRoutes) will render here */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default Navbar;