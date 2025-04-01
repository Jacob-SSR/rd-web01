import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Shield,
  Award,
  FileText,
  Tag,
  BarChart2,
  User,
  AlertTriangle,
  Trophy, // Added missing Trophy import
} from "lucide-react";
import {
  getAllUsers,
  getAllChallenges,
  getAllBadges,
  getAllCategories,
} from "../../api/exportAllApi";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    challenges: 0,
    badges: 0,
    categories: 0,
    bannedUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [users, challenges, badges, categories] = await Promise.all([
          getAllUsers(),
          getAllChallenges(),
          getAllBadges(),
          getAllCategories(),
        ]);

        setStats({
          users: users.length,
          challenges: challenges.length,
          badges: badges.length,
          categories: categories.length,
          bannedUsers: users.filter((user) => user.isBanned).length,
        });

        // Get most recent 5 users
        const sortedUsers = [...users]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentUsers(sortedUsers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("ไม่สามารถโหลดข้อมูลได้ โปรดลองอีกครั้งในภายหลัง");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <AlertTriangle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/users/banlist" className="btn btn-sm btn-outline">
            <Users size={16} className="mr-1" />
            จัดการผู้ใช้
          </Link>
          <Link to="/admin/badges" className="btn btn-sm btn-outline">
            <Award size={16} className="mr-1" />
            จัดการตรารางวัล
          </Link>
          <Link to="/admin/categories" className="btn btn-sm btn-outline">
            <Tag size={16} className="mr-1" />
            จัดการหมวดหมู่
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-base">ผู้ใช้ทั้งหมด</h2>
              <User className="text-primary" size={24} />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.users}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-base">ชาเลนจ์</h2>
              <Trophy className="text-primary" size={24} />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.challenges}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-base">ตรารางวัล</h2>
              <Award className="text-primary" size={24} />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.badges}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-base">หมวดหมู่</h2>
              <Tag className="text-primary" size={24} />
            </div>
            <p className="text-3xl font-bold mt-2">{stats.categories}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-base">ผู้ใช้ที่ถูกแบน</h2>
              <Shield className="text-error" size={24} />
            </div>
            <p className="text-3xl font-bold mt-2 text-error">
              {stats.bannedUsers}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="card-body p-0">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">ผู้ใช้ลงทะเบียนล่าสุด</h2>
            <Link to="/admin/users" className="btn btn-sm btn-ghost">
              ดูทั้งหมด
            </Link>
          </div>

          {/* Recent Users List */}
          <div className="divide-y">
            {recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 hover:bg-base-200 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={user.profilePicture || "/default-avatar.png"}
                        alt={user.username}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{user.username}</div>
                    <div className="text-sm opacity-50">{user.email}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
