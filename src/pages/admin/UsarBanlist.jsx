import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Shield, Search, AlertTriangle, User, X } from "lucide-react";
import { getAllUsers, banUser, unbanUser } from "../../api/exportAllApi";

function UserBanlist() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBanned, setShowBanned] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [showBanModal, setShowBanModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by banned status
    if (showBanned) {
      filtered = filtered.filter((user) => user.isBanned);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, showBanned]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("ไม่สามารถโหลดข้อมูลผู้ใช้ได้ โปรดลองอีกครั้งในภายหลัง");
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) return;

    try {
      setActionLoading(true);
      await banUser({
        userId: selectedUser.id,
        reason: banReason.trim(),
      });

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? { ...user, isBanned: true, banReason: banReason.trim() }
            : user
        )
      );

      // Reset form
      setSelectedUser(null);
      setBanReason("");
      setShowBanModal(false);
    } catch (err) {
      setError("การแบนผู้ใช้ล้มเหลว: " + (err.message || "กรุณาลองอีกครั้ง"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      setActionLoading(true);
      await unbanUser({ userId });

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, isBanned: false, banReason: null }
            : user
        )
      );
    } catch (err) {
      setError(
        "การยกเลิกแบนผู้ใช้ล้มเหลว: " + (err.message || "กรุณาลองอีกครั้ง")
      );
    } finally {
      setActionLoading(false);
    }
  };

  const openBanModal = (user) => {
    setSelectedUser(user);
    setBanReason("");
    setShowBanModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">จัดการผู้ใช้</h1>
        <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
          กลับไปหน้า Dashboard
        </Link>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <AlertTriangle size={18} />
          <span>{error}</span>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => setError(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="form-control flex-1">
          <div className="input-group">
            <input
              type="text"
              placeholder="ค้นหาผู้ใช้จากชื่อผู้ใช้หรืออีเมล..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-square">
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="form-control">
          <label className="cursor-pointer label flex gap-2">
            <span className="label-text">แสดงเฉพาะผู้ใช้ที่ถูกแบน</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={showBanned}
              onChange={() => setShowBanned(!showBanned)}
            />
          </label>
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 shadow-xl overflow-hidden">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ชื่อผู้ใช้</th>
                  <th>อีเมล</th>
                  <th>บทบาท</th>
                  <th>วันที่ลงทะเบียน</th>
                  <th>สถานะ</th>
                  <th className="text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
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
                        <div className="tooltip" data-tip={user.banReason}>
                          <span className="badge badge-error gap-1">
                            <Shield size={14} />
                            แบน
                          </span>
                        </div>
                      ) : (
                        <span className="badge badge-success">ปกติ</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="btn btn-xs btn-outline"
                        >
                          รายละเอียด
                        </Link>

                        {user.role !== "ADMIN" &&
                          (user.isBanned ? (
                            <button
                              className="btn btn-xs btn-success"
                              onClick={() => handleUnbanUser(user.id)}
                              disabled={actionLoading}
                            >
                              ยกเลิกแบน
                            </button>
                          ) : (
                            <button
                              className="btn btn-xs btn-error"
                              onClick={() => openBanModal(user)}
                              disabled={actionLoading}
                            >
                              แบน
                            </button>
                          ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      ไม่พบข้อมูลผู้ใช้ตามเงื่อนไขที่กำหนด
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ban User Modal */}
      {showBanModal && selectedUser && (
        <dialog className="modal modal-open">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">
              แบนผู้ใช้: {selectedUser.username}
            </h3>
            <div className="py-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">เหตุผลในการแบน</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="ระบุเหตุผลในการแบนผู้ใช้..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setShowBanModal(false)}
              >
                ยกเลิก
              </button>
              <button
                className={`btn btn-error ${actionLoading ? "loading" : ""}`}
                onClick={handleBanUser}
                disabled={actionLoading || !banReason.trim()}
              >
                {actionLoading ? "กำลังดำเนินการ..." : "ยืนยันการแบน"}
              </button>
            </div>
          </form>
          <div
            className="modal-backdrop"
            onClick={() => setShowBanModal(false)}
          ></div>
        </dialog>
      )}
    </div>
  );
}

export default UserBanlist;
