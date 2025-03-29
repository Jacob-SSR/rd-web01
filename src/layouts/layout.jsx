import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar - always present but can be collapsed */}
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      </div>
      
      {/* Mobile Sidebar Overlay - only shown when toggled */}
      {mobileSidebarOpen && (
        <div className="block md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMobileSidebar}></div>
          <div className="relative h-full w-64">
            <Sidebar collapsed={false} toggleSidebar={toggleMobileSidebar} />
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-primary text-primary-content p-4 flex items-center">
          <button className="btn btn-ghost btn-circle" onClick={toggleMobileSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl ml-4">Challenge App</h1>
        </div>
        
        {/* Page Content - scrollable area */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;