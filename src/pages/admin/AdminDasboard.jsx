import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Users,
  Shield,
  Award,
  FileText,
  Tag,
  BarChart2,
  User,
  AlertTriangle,
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

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ชื่อผู้ใช้</th>
                  <th>อีเมล</th>
                  <th>บทบาท</th>
                  <th>วันที่ลงทะเบียน</th>
                  <th>สถานะ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.username} />
                          ) : (
                            <div className="bg-primary text-primary-content flex items-center justify-center h-full">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      {user.username}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          user.role === "ADMIN"
                            ? "badge-primary"
                            : "badge-ghost"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      {user.isBanned ? (
                        <span className="badge badge-error">แบน</span>
                      ) : (
                        <span className="badge badge-success">ปกติ</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="btn btn-xs btn-outline"
                      >
                        รายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      ไม่พบข้อมูลผู้ใช้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

function Trophy(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
