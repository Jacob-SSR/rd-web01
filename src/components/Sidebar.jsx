import React from 'react';
import { Link } from 'react-router';
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
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function Sidebar({ collapsed = false, toggleSidebar }) {
  const { user, logout } = useStore();
  
  return (
    <div className={`bg-primary text-primary-content h-screen ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex flex-col`}>
      {/* Toggle button */}
      <button 
        className="absolute right-0 top-20 bg-primary text-primary-content p-1 rounded-r-md translate-x-full"
        onClick={toggleSidebar}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      
      {/* Profile section */}
      <div className="p-4 flex flex-col items-center border-b border-primary-focus">
        <div className="avatar">
          <div className="w-16 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2 mb-2">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
              />
            ) : (
              <div className="bg-primary-content text-primary flex items-center justify-center h-full">
                {user?.username?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
        </div>
        
        {!collapsed && (
          <>
            <h3 className="font-bold text-lg mt-2">{user?.username || 'User'}</h3>
            <p className="text-xs opacity-70 mb-2">Level {user?.level || 1}</p>
            
            {/* Experience bar */}
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
          </>
        )}
      </div>
      
      {/* Navigation links */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="menu menu-md px-2">
          <li>
            <Link to="/" className={`${collapsed ? 'justify-center' : ''}`}>
              <Home size={20} />
              {!collapsed && <span>Home</span>}
            </Link>
          </li>
          <li>
            <Link to="/challenge" className={`${collapsed ? 'justify-center' : ''}`}>
              <Trophy size={20} />
              {!collapsed && <span>Challenges</span>}
            </Link>
          </li>
          <li>
            <Link to="/daily-challenge" className={`${collapsed ? 'justify-center' : ''}`}>
              <Calendar size={20} />
              {!collapsed && <span>Daily Challenge</span>}
            </Link>
          </li>
          <li>
            <Link to="/my-challenges" className={`${collapsed ? 'justify-center' : ''}`}>
              <Users size={20} />
              {!collapsed && <span>My Challenges</span>}
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`${collapsed ? 'justify-center' : ''}`}>
              <User size={20} />
              {!collapsed && <span>Profile</span>}
            </Link>
          </li>
          <li>
            <Link to="/settings" className={`${collapsed ? 'justify-center' : ''}`}>
              <Settings size={20} />
              {!collapsed && <span>Settings</span>}
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Badges section (only visible when expanded) */}
      {!collapsed && (
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
              // Placeholder badges if none earned yet
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
      )}
      
      {/* Logout button */}
      <div className="p-4 border-t border-primary-focus">
        <button 
          onClick={logout}
          className={`btn ${collapsed ? 'btn-square' : 'btn-block'} btn-outline text-primary-content hover:bg-primary-focus hover:text-primary-content`}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;