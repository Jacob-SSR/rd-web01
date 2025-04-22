// src/pages/EnhancedProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Medal, 
  Trophy, 
  Award, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Mail, 
  Edit,
  BarChart2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  PieChart
} from 'lucide-react';
import { useStore } from '../stores/userStore';
import { getUserProfile, getUserChallengeHistory, getUserBadges } from '../api/exportAllApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function EnhancedProfile() {
  const { user } = useStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [challengeHistory, setChallengeHistory] = useState({
    completed: [],
    inProgress: [],
    pending: []
  });
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({
    totalChallengesJoined: 0,
    completedChallenges: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalExperience: 0,
    completionRate: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile, challenge history, and badges in parallel
      const [profileData, historyData, badgesData] = await Promise.all([
        getUserProfile(),
        getUserChallengeHistory(),
        getUserBadges()
      ]);
      
      setProfile(profileData.user);
      
      // Process challenge history
      if (historyData && historyData.history) {
        setChallengeHistory({
          completed: historyData.history.completed || [],
          inProgress: historyData.history.inProgress || [],
          pending: historyData.history.pending || []
        });
        
        // Calculate stats
        const totalChallenges = 
          (historyData.history.completed?.length || 0) + 
          (historyData.history.inProgress?.length || 0) + 
          (historyData.history.pending?.length || 0);
        
        const completedCount = historyData.history.completed?.length || 0;
        
        setStats({
          totalChallengesJoined: totalChallenges,
          completedChallenges: completedCount,
          currentStreak: historyData.stats?.currentStreak || calculateStreak(historyData.history.completed),
          longestStreak: historyData.stats?.longestStreak || calculateLongestStreak(historyData.history.completed),
          totalExperience: historyData.stats?.totalExpEarned || calculateTotalExp(historyData.history.completed),
          completionRate: totalChallenges > 0 ? Math.round((completedCount / totalChallenges) * 100) : 0
        });
      }
      
      // Process badges
      if (badgesData && badgesData.badges) {
        setBadges(badgesData.badges);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('ไม่สามารถโหลดข้อมูลโปรไฟล์ได้ โปรดลองอีกครั้งในภายหลัง');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to calculate current streak
  const calculateStreak = (completedChallenges) => {
    if (!completedChallenges || completedChallenges.length === 0) return 0;
    
    // This is a simplified calculation for demonstration
    // In a real app, you'd track daily completions
    return Math.min(completedChallenges.length, 7);
  };

  // Helper function to calculate longest streak
  const calculateLongestStreak = (completedChallenges) => {
    if (!completedChallenges || completedChallenges.length === 0) return 0;
    
    // Simplified calculation for demonstration
    return Math.min(completedChallenges.length, 14);
  };

  // Helper function to calculate total XP earned
  const calculateTotalExp = (completedChallenges) => {
    if (!completedChallenges || completedChallenges.length === 0) return 0;
    
    return completedChallenges.reduce((total, challenge) => {
      return total + (challenge.challenge?.expReward || 100);
    }, 0);
  };

  // Prepare chart data
  const getChartData = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date;
    });
    
    // Format dates as strings (e.g. "Mon, Tue, etc.")
    const formattedDates = last7Days.map(date => {
      return date.toLocaleDateString('th-TH', { weekday: 'short' });
    });
    
    // Count completed challenges per day (mock data for demonstration)
    const mockCompletions = [0, 1, 0, 2, 1, 0, 1];
    
    return formattedDates.map((day, index) => ({
      day,
      count: mockCompletions[index]
    }));
  };
  
  // Prepare categories donut chart data
  const getCategoryData = () => {
    // Calculate challenge counts by category
    const categoryMap = {};
    
    const allChallenges = [
      ...challengeHistory.completed,
      ...challengeHistory.inProgress,
      ...challengeHistory.pending
    ];
    
    allChallenges.forEach(item => {
      if (item.challenge && item.challenge.categories) {
        item.challenge.categories.forEach(category => {
          if (categoryMap[category.name]) {
            categoryMap[category.name]++;
          } else {
            categoryMap[category.name] = 1;
          }
        });
      }
    });
    
    // Convert to array for chart
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error shadow-lg">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Profile Header */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row items-center">
            {/* Avatar */}
            <div className="avatar mb-4 md:mb-0 md:mr-6">
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" />
                ) : (
                  <div className="bg-primary text-primary-content flex items-center justify-center h-full">
                    <span className="text-3xl font-bold">
                      {profile?.firstname?.charAt(0) || profile?.username?.charAt(0) || user?.username?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-2xl font-bold">{profile?.username || user?.username}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 my-2">
                <div className="badge badge-primary">Level {profile?.level || 1}</div>
                {user?.role === 'ADMIN' && (
                  <div className="badge badge-secondary">Admin</div>
                )}
              </div>
              <p className="text-base-content opacity-70 mb-2">
                {profile?.firstname && profile?.lastname 
                  ? `${profile.firstname} ${profile.lastname}` 
                  : 'ยังไม่ได้เพิ่มชื่อ-นามสกุล'}
              </p>
              <div className="flex items-center justify-center md:justify-start text-sm opacity-70">
                <Mail size={14} className="mr-1" />
                <span>{profile?.email || user?.email}</span>
              </div>
            </div>
            
            {/* Right Side - XP and Edit Button */}
            <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-center md:items-end">
              <Link to="/settings" className="btn btn-sm btn-ghost mb-2">
                <Edit size={14} className="mr-1" />
                แก้ไขโปรไฟล์
              </Link>
              
              <div className="w-full max-w-xs md:max-w-[200px]">
                <div className="flex justify-between text-xs mb-1">
                  <span>XP</span>
                  <span>{profile?.exp || 0}/{profile?.expToNextLevel || 100}</span>
                </div>
                <progress 
                  className="progress progress-primary w-full h-2" 
                  value={profile?.exp || 0} 
                  max={profile?.expToNextLevel || 100}
                ></progress>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <a 
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          ภาพรวม
        </a>
        <a 
          className={`tab ${activeTab === 'challenges' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
          ความท้าทาย
        </a>
        <a 
          className={`tab ${activeTab === 'badges' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('badges')}
        >
          ตรารางวัล
        </a>
        <a 
          className={`tab ${activeTab === 'stats' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          สถิติ
        </a>
      </div>
      
      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="card bg-base-100 shadow">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="card-title text-lg mb-0">ท้าทายสำเร็จ</h3>
                      <p className="text-3xl font-bold">{stats.completedChallenges}</p>
                    </div>
                    <Trophy className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="card-title text-lg mb-0">สต ที่ได้รับ</h3>
                      <p className="text-3xl font-bold">{stats.totalExperience}</p>
                    </div>
                    <Award className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="card-title text-lg mb-0">สตรีคปัจจุบัน</h3>
                      <p className="text-3xl font-bold">{stats.currentStreak}</p>
                    </div>
                    <Clock className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="card-title text-lg mb-0">อัตราความสำเร็จ</h3>
                      <p className="text-3xl font-bold">{stats.completionRate}%</p>
                    </div>
                    <PieChart className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity and Badges Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Challenges */}
              <div className="lg:col-span-2">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-center">
                      <h2 className="card-title">ความท้าทายล่าสุด</h2>
                      <Link to="#" onClick={() => setActiveTab('challenges')} className="text-primary text-sm flex items-center">
                        ดูทั้งหมด
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                    
                    <div className="divider my-1"></div>
                    
                    {challengeHistory.inProgress.length > 0 || challengeHistory.completed.length > 0 ? (
                      <div className="space-y-4">
                        {/* Show in progress first, then most recently completed */}
                        {[...challengeHistory.inProgress, ...challengeHistory.completed]
                          .slice(0, 5)
                          .map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-start gap-3">
                                <div className="mt-1">
                                  {item.status === 'COMPLETED' ? (
                                    <CheckCircle size={18} className="text-success" />
                                  ) : (
                                    <Clock size={18} className="text-warning" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-medium">{item.challenge?.name || 'ความท้าทาย'}</h3>
                                  <p className="text-sm opacity-70">
                                    {item.status === 'COMPLETED' 
                                      ? `สำเร็จเมื่อ ${formatDate(item.completedAt || item.submittedAt)}` 
                                      : 'กำลังดำเนินการ'}
                                  </p>
                                </div>
                              </div>
                              {item.challenge?.expReward && (
                                <div className="badge badge-primary">+{item.challenge.expReward} XP</div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Trophy className="mx-auto h-16 w-16 text-base-300 mb-4" />
                        <h3 className="font-bold text-lg">ยังไม่มีความท้าทาย</h3>
                        <p className="text-base-content opacity-70">เริ่มความท้าทายตอนนี้เพื่อเพิ่มระดับและรับรางวัล</p>
                        <Link to="/challenge" className="btn btn-primary mt-4">
                          สำรวจความท้าทาย
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Badges Preview */}
              <div className="lg:col-span-1">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex justify-between items-center">
                      <h2 className="card-title">ตรารางวัลของฉัน</h2>
                      <Link to="#" onClick={() => setActiveTab('badges')} className="text-primary text-sm flex items-center">
                        ดูทั้งหมด
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                    
                    <div className="divider my-1"></div>
                    
                    {badges.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {badges.slice(0, 4).map((badge, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className="avatar">
                              <div className="w-16 rounded-full bg-primary-focus text-primary-content flex items-center justify-center">
                                {badge.badge?.image ? (
                                  <img src={badge.badge.image} alt={badge.badge.name} />
                                ) : (
                                  <Medal size={24} className="text-white" />
                                )}
                              </div>
                            </div>
                            <h3 className="text-center mt-2 font-medium">{badge.badge?.name || 'ตรารางวัล'}</h3>
                            <p className="text-xs text-center opacity-70">{formatDate(badge.earnedAt)}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Award className="mx-auto h-16 w-16 text-base-300 mb-4" />
                        <h3 className="font-bold text-lg">ยังไม่มีตรารางวัล</h3>
                        <p className="text-base-content opacity-70">ทำความท้าทายให้สำเร็จเพื่อรับตรารางวัล</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">ความท้าทายทั้งหมด</h2>
              
              <div className="tabs tabs-boxed bg-base-200 mb-6">
                <a 
                  className={`tab ${
                    challengeHistory.inProgress.length > 0 ? '' : 'tab-active'
                  }`}
                  onClick={() => {}}
                >
                  สำเร็จแล้ว ({challengeHistory.completed.length})
                </a>
                <a 
                  className={`tab ${
                    challengeHistory.inProgress.length > 0 ? 'tab-active' : ''
                  }`}
                  onClick={() => {}}
                >
                  กำลังดำเนินการ ({challengeHistory.inProgress.length})
                </a>
                <a 
                  className="tab"
                  onClick={() => {}}
                >
                  รอการอนุมัติ ({challengeHistory.pending.length})
                </a>
              </div>
              
              {challengeHistory.inProgress.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>ความท้าทาย</th>
                        <th>หมวดหมู่</th>
                        <th>สถานะ</th>
                        <th>รางวัล</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {challengeHistory.inProgress.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="font-bold">{item.challenge?.name || 'ความท้าทาย'}</div>
                            <div className="text-sm opacity-70">เริ่ม: {formatDate(item.startedAt || item.challenge?.createdAt)}</div>
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-1">
                              {item.challenge?.categories?.map((cat, i) => (
                                <span key={i} className="badge badge-outline badge-xs">{cat.name}</span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="badge badge-warning gap-1">
                              <Clock size={12} />
                              กำลังดำเนินการ
                            </div>
                          </td>
                          <td>{item.challenge?.expReward || 100} XP</td>
                          <td>
                            <Link 
                              to={`/challenges/${item.challenge?.id}`} 
                              className="btn btn-xs btn-primary"
                            >
                              ส่งหลักฐาน
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>ความท้าทาย</th>
                        <th>หมวดหมู่</th>
                        <th>สถานะ</th>
                        <th>รางวัล</th>
                        <th>สำเร็จเมื่อ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {challengeHistory.completed.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="font-bold">{item.challenge?.name || 'ความท้าทาย'}</div>
                          </td>
                          <td>
                            <div className="flex flex-wrap gap-1">
                              {item.challenge?.categories?.map((cat, i) => (
                                <span key={i} className="badge badge-outline badge-xs">{cat.name}</span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="badge badge-success gap-1">
                              <CheckCircle size={12} />
                              สำเร็จ
                            </div>
                          </td>
                          <td>{item.challenge?.expReward || 100} XP</td>
                          <td>{formatDate(item.completedAt || item.submittedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {challengeHistory.completed.length === 0 && challengeHistory.inProgress.length === 0 && (
                <div className="text-center py-8">
                  <Trophy className="mx-auto h-16 w-16 text-base-300 mb-4" />
                  <h3 className="font-bold text-lg">ยังไม่มีความท้าทาย</h3>
                  <p className="text-base-content opacity-70 mb-4">เข้าร่วมความท้าทายเพื่อเพิ่มระดับและรับรางวัล</p>
                  <Link to="/challenge" className="btn btn-primary">
                    สำรวจความท้าทาย
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-6">ตรารางวัลทั้งหมด</h2>
              
              {badges.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {badges.map((badge, index) => (
                    <div key={index} className="card bg-base-200">
                      <div className="card-body items-center text-center p-4">
                        <div className="avatar mb-2">
                          <div className="w-20 rounded-full bg-primary-focus text-primary-content flex items-center justify-center">
                            {badge.badge?.image ? (
                              <img src={badge.badge.image} alt={badge.badge.name} />
                            ) : (
                              <Medal size={32} className="text-white" />
                            )}
                          </div>
                        </div>
                        <h3 className="card-title text-base">{badge.badge?.name || 'ตรารางวัล'}</h3>
                        <p className="text-xs opacity-70 mb-2">{badge.badge?.description || 'รายละเอียดตรารางวัล'}</p>
                        <p className="text-xs">ได้รับเมื่อ: {formatDate(badge.earnedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="mx-auto h-16 w-16 text-base-300 mb-4" />
                  <h3 className="font-bold text-lg">ยังไม่มีตรารางวัล</h3>
                  <p className="text-base-content opacity-70 mb-4">ทำความท้าทายให้สำเร็จเพื่อรับตรารางวัล</p>
                  <Link to="/challenge" className="btn btn-primary">
                    สำรวจความท้าทาย
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Chart */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">กิจกรรมรายวัน</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getChartData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" name="จำนวนความท้าทายที่ทำสำเร็จ" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Stats Summary */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">สรุปสถิติ</h2>
                  
                  <div className="stats stats-vertical shadow">
                    <div className="stat">
                      <div className="stat-title">ความท้าทายทั้งหมด</div>
                      <div className="stat-value">{stats.totalChallengesJoined}</div>
                      <div className="stat-desc">ตั้งแต่เริ่มใช้งาน {formatDate(profile?.createdAt)}</div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-title">อัตราความสำเร็จ</div>
                      <div className="stat-value">{stats.completionRate}%</div>
                      <div className="stat-desc">
                        {stats.completedChallenges} สำเร็จจากทั้งหมด {stats.totalChallengesJoined}
                      </div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-title">สตรีคยาวที่สุด</div>
                      <div className="stat-value">{stats.longestStreak}</div>
                      <div className="stat-desc">วัน</div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-title">คะแนนประสบการณ์ทั้งหมด</div>
                      <div className="stat-value">{stats.totalExperience}</div>
                      <div className="stat-desc">XP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PieChart(props) {
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
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
      <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
    </svg>
  );
}

export default EnhancedProfile;