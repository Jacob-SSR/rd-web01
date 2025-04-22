import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useStore } from '../stores/userStore';

function AdminLink() {
  const { user } = useStore();
  
  // If user is not admin, don't render anything
  if (user?.role !== 'ADMIN') {
    return null;
  }
  
  return (
    <li>
      <Link to="/admin/dashboard" className="flex items-center gap-2 text-warning font-medium">
        <Shield size={20} />
        <span>Admin Dashboard</span>
      </Link>
    </li>
  );
}

export default AdminLink;