import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Camera, Award, Clock, Calendar, Medal } from "lucide-react";
import useStore from "../stores/userStore";
import {
  getUserProfile,
  getUserBadges,
  getUserChallengeHistory,
} from "../api/exportAllApi";

function MyProfile() {
  const { user } = useStore();
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [challengeHistory, setChallengeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [profileData, badgesData, historyData] = await Promise.all([
          getUserProfile(),
          getUserBadges(),
          getUserChallengeHistory(),
        ]);

        setProfile(profileData);
        setBadges(badgesData);
        setChallengeHistory(historyData);
      } catch (err) {
        setError("Failed to load profile data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Calculate current streak
  const calculateStreak = () => {
    if (!challengeHistory || challengeHistory.length === 0) return 0;

    // This is a simplified streak calculation - in a real app, you'd need more sophisticated logic
    return 1; // For demo purposes
  };

  // Get the last completed challenge
  const getLastChallenge = () => {
    if (!challengeHistory || challengeHistory.length === 0) return null;

    const completed = challengeHistory.filter(
      (ch) => ch.status === "completed"
    );
    if (completed.length === 0) return null;

    // Return the most recent completed challenge
    return completed.sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
    )[0];
  };

  // Get most recent achievement/badge
  const getRecentAchievement = () => {
    if (!badges || badges.length === 0) return null;

    // Return the most recently earned badge
    return badges.sort(
      (a, b) => new Date(b.earnedAt) - new Date(a.earnedAt)
    )[0];
  };

  const lastChallenge = getLastChallenge();
  const recentAchievement = getRecentAchievement();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="bg-primary text-primary-content w-full md:w-64 p-6 flex flex-col items-center">
        {/* Profile Picture */}
        <div className="avatar relative mb-4">
          <div className="w-28 rounded-full ring ring-accent ring-offset-base-100 ring-offset-2">
            {profile?.profileImage ? (
              <img src={profile.profileImage} alt="Profile" />
            ) : (
              <div className="bg-primary-content text-primary flex items-center justify-center text-4xl font-bold h-full">
                {profile?.firstname?.charAt(0) ||
                  user?.username?.charAt(0) ||
                  "?"}
              </div>
            )}
          </div>
          <button className="btn btn-circle btn-xs btn-accent absolute bottom-0 right-0">
            <Camera size={16} />
          </button>
        </div>

        {/* Username */}
        <h2 className="text-xl font-bold mb-1">
          {profile?.username || user?.username || "[Username]"}
        </h2>

        {/* Join Date */}
        <p className="text-sm text-primary-content opacity-70 mb-4">
          joined:{" "}
          {profile?.createdAt
            ? new Date(profile.createdAt).toLocaleDateString()
            : "[Date]"}
        </p>

        {/* Edit Profile Button */}
        <Link to="/settings" className="btn btn-accent btn-block mb-8">
          Edit Profile
        </Link>

        {/* Level */}
        <div className="w-full mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">Level {profile?.level || 1}</span>
            <span className="text-xs text-primary-content opacity-70">
              {profile?.experience || 0}/100 XP
            </span>
          </div>
          <progress
            className="progress progress-accent w-full"
            value={profile?.experience || 0}
            max="100"
          ></progress>
        </div>

        {/* Badges */}
        <div className="w-full">
          <h3 className="text-sm font-medium mb-3">Badge Showcase</h3>
          <div className="flex justify-center space-x-2">
            {badges.length > 0
              ? badges.slice(0, 3).map((badge, index) => (
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
              : // Placeholder badges if none earned yet
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                        <span className="text-xs">
                          <Award size={16} />
                        </span>
                      </div>
                    </div>
                  ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        {/* Welcome Message and Start Challenge Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h1 className="text-xl font-medium mb-4 md:mb-0">
            Welcome back, {profile?.username || user?.username || "[Username]"}!
            Are you ready for today's challenge?
          </h1>

          <Link to="/daily-challenge">
            <button className="btn btn-accent">Start Challenge</button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Streak */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-neutral">Current Streak</h3>
              <div className="flex items-center gap-2 text-3xl font-bold">
                <Clock size={20} className="text-primary" />
                <span>{calculateStreak()} Days</span>
              </div>
            </div>
          </div>

          {/* Last Challenge */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-neutral">Last Challenge</h3>
              {lastChallenge ? (
                <div className="flex items-center gap-2 font-medium">
                  <Calendar size={20} className="text-primary" />
                  <span>{lastChallenge.title || "Workout 7 Day"}</span>
                </div>
              ) : (
                <div className="text-gray-500">No challenges completed yet</div>
              )}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h3 className="card-title text-neutral">Recent Achievements</h3>

              {recentAchievement ? (
                <div className="flex flex-col items-center">
                  <div className="avatar">
                    <div className="w-14 rounded-full bg-accent-focus text-accent-content flex items-center justify-center">
                      {recentAchievement.icon ? (
                        <img
                          src={recentAchievement.icon}
                          alt={recentAchievement.name}
                        />
                      ) : (
                        <Medal size={24} />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 font-medium">
                    {recentAchievement.name || "Fitness Beginner"}
                  </div>
                  <div className="badge badge-accent mt-1">
                    Tier: {recentAchievement.tier || "RARE"}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">No achievements earned yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
