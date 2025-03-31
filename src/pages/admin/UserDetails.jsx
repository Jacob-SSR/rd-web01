import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Award,
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Info,
} from "lucide-react";
import {
  getAllUsers,
  banUser,
  unbanUser,
  getUserBadges,
  getUserChallengeHistory,
  assignBadgeToUser,
} from "../../api/exportAllApi";

function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [badges, setBadges] = useState([]);
  const [challengeHistory, setChallengeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [showBanForm, setShowBanForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      // Get all users and find the one that matches the userId
      const allUsers = await getAllUsers();
      const targetUser = allUsers.find(
        (u) => u.id === userId || u.id === parseInt(userId)
      );

      if (!targetUser) {
        setError("ไม่พบข้อมูลผู้ใช้");
        setLoading(false);
        return;
      }

      setUser(targetUser);

      // Fetch user badges and challenge history
      try {
        const [badgesData, historyData] = await Promise.all([
          getUserBadges(userId),
          getUserChallengeHistory(userId),
        ]);

        setBadges(badgesData || []);
        setChallengeHistory(historyData || []);
      } catch (err) {
        console.error("Error fetching user history:", err);
        // This error is not critical, so we just log it
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to load user details:", err);
      setError("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      setLoading(false);
    }
  };

  const handleBanUser = async (e) => {
    e.preventDefault();
    if (!banReason.trim()) {
      setError("กรุณาระบุเหตุผลในการแบน");
      return;
    }

    try {
      setActionLoading(true);
      await banUser({
        userId,
        reason: banReason,
      });

      // Update user data locally
      setUser((prev) => ({
        ...prev,
        isBanned: true,
        banReason,
      }));

      setShowBanForm(false);
      setBanReason("");
      setActionLoading(false);
    } catch (err) {
      setError("การแบนผู้ใช้ล้มเหลว");
      setActionLoading(false);
      console.error(err);
    }
  };

  const handleUnbanUser = async () => {
    try {
      setActionLoading(true);
      await unbanUser({ userId });

      // Update user data locally
      setUser((prev) => ({
        ...prev,
        isBanned: false,
        banReason: null,
      }));

      setActionLoading(false);
    } catch (err) {
      setError("การยกเลิกแบนผู้ใช้ล้มเหลว");
      setActionLoading(false);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error shadow-lg">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="btn btn-primary"
          >
            <ArrowLeft size={16} className="mr-2" />
            กลับไปหน้า Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link to="/admin/users/banlist" className="btn btn-ghost btn-sm">
            <ArrowLeft size={18} />
            <span className="hidden md:inline">กลับ</span>
          </Link>
          <h1 className="text-2xl font-bold">รายละเอียดผู้ใช้</h1>
        </div>

        {error && (
          <div className="alert alert-error p-2 w-auto">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col items-center mb-4">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={user.username} />
                  ) : (
                    <div className="bg-primary text-primary-content flex items-center justify-center h-full">
                      <span className="text-3xl font-bold">
                        {user.username?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold">{user.username}</h2>

              <div className="badge mt-1 badge-primary">{user.role}</div>

              {user.isBanned && (
                <div className="badge badge-error gap-1 mt-2">
                  <Shield size={12} />
                  ถูกแบน
                </div>
              )}
            </div>

            <div className="divider"></div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User size={18} className="text-primary" />
                <div>
                  <div className="text-sm opacity-70">ชื่อ-นามสกุล</div>
                  <div>
                    {user.firstname && user.lastname
                      ? `${user.firstname} ${user.lastname}`
                      : "ไม่ได้ระบุ"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <div>
                  <div className="text-sm opacity-70">อีเมล</div>
                  <div>{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-primary" />
                <div>
                  <div className="text-sm opacity-70">วันที่ลงทะเบียน</div>
                  <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Activity size={18} className="text-primary" />
                <div>
                  <div className="text-sm opacity-70">สถานะ</div>
                  <div className="font-medium">
                    {user.isBanned ? (
                      <span className="text-error">ถูกแบน</span>
                    ) : (
                      <span className="text-success">ปกติ</span>
                    )}
                  </div>
                </div>
              </div>

              {user.isBanned && (
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-error" />
                  <div>
                    <div className="text-sm opacity-70">เหตุผลในการแบน</div>
                    <div className="text-error">{user.banReason}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="divider"></div>

            {/* Ban/Unban Actions */}
            {user.role !== "ADMIN" &&
              (user.isBanned ? (
                <button
                  onClick={handleUnbanUser}
                  className={`btn btn-success btn-block ${
                    actionLoading ? "loading" : ""
                  }`}
                  disabled={actionLoading}
                >
                  <CheckCircle size={18} className="mr-2" />
                  ยกเลิกการแบนผู้ใช้
                </button>
              ) : (
                <button
                  onClick={() => setShowBanForm(true)}
                  className="btn btn-error btn-block"
                >
                  <Shield size={18} className="mr-2" />
                  แบนผู้ใช้
                </button>
              ))}
          </div>
        </div>

        {/* User Badges */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <Award size={20} className="text-primary" />
              ตรารางวัล
            </h2>

            {badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {badges.map((badge, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="avatar">
                      <div className="w-16 rounded-full bg-base-300">
                        {badge.icon ? (
                          <img src={badge.icon} alt={badge.name} />
                        ) : (
                          <div className="bg-primary text-primary-content flex items-center justify-center h-full">
                            <Award size={24} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-xs opacity-70">
                        {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info mt-4">
                <Info size={18} />
                <span>ผู้ใช้ยังไม่มีตรารางวัล</span>
              </div>
            )}

            <div className="divider"></div>

            <button className="btn btn-outline btn-primary btn-sm">
              <Award size={16} className="mr-2" />
              มอบตรารางวัล
            </button>
          </div>
        </div>

        {/* Challenge History */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">
              <Trophy size={20} className="text-primary" />
              ประวัติการทำชาเลนจ์
            </h2>

            {challengeHistory.length > 0 ? (
              <div className="overflow-x-auto mt-4">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>ชาเลนจ์</th>
                      <th>สถานะ</th>
                      <th>วันที่</th>
                    </tr>
                  </thead>
                  <tbody>
                    {challengeHistory.map((challenge, index) => (
                      <tr key={index}>
                        <td>{challenge.title}</td>
                        <td>
                          {challenge.status === "completed" && (
                            <span className="badge badge-success gap-1">
                              <CheckCircle size={12} />
                              สำเร็จ
                            </span>
                          )}
                          {challenge.status === "pending" && (
                            <span className="badge badge-warning gap-1">
                              <Clock size={12} />
                              รอดำเนินการ
                            </span>
                          )}
                          {challenge.status === "failed" && (
                            <span className="badge badge-error gap-1">
                              <XCircle size={12} />
                              ล้มเหลว
                            </span>
                          )}
                        </td>
                        <td className="text-sm">
                          {new Date(challenge.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info mt-4">
                <Info size={18} />
                <span>ผู้ใช้ยังไม่มีประวัติการทำชาเลนจ์</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ban User Form */}
      {showBanForm && (
        <div className="modal modal-open">
          <form method="dialog" className="modal-box" onSubmit={handleBanUser}>
            <h3 className="font-bold text-lg">แบนผู้ใช้: {user.username}</h3>
            <div className="form-control mt-4">
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
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setShowBanForm(false);
                  setBanReason("");
                }}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className={`btn btn-error ${actionLoading ? "loading" : ""}`}
                disabled={actionLoading || !banReason.trim()}
              >
                {actionLoading ? "กำลังดำเนินการ..." : "ยืนยันการแบน"}
              </button>
            </div>
          </form>
          <div
            className="modal-backdrop"
            onClick={() => setShowBanForm(false)}
          ></div>
        </div>
      )}
    </div>
  );
}

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

export default UserDetails;
