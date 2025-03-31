// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router"; // Fixed imports
import ChallengePage from "../pages/ChallengePage";
import DailyChallenge from "../pages/DailyChallene"; // Note: File has typo, should be fixed
import MyChallenge from "../pages/MyChallenge";
import PublicChallenge from "../pages/PublicChallenge"; // Note: File has typo, should be fixed
import Setting from "../pages/Setting";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/admin/AdminDasboard";
import UserBanlist from "../pages/admin/UsarBanlist";
import UserDetails from "../pages/admin/UserDetails";
import { useStore } from "../stores/userStore";
import MyProfile from "../pages/MyProfile";

function AppRoutes() {
  const { isAuthenticated, user } = useStore();

  // If not authenticated, only show login/register pages
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // User is authenticated, show full app
  return (
    <Routes>
      <Route path="/" element={<ChallengePage />} />
      <Route path="/challenge" element={<ChallengePage />} />
      <Route path="/daily-challenge" element={<DailyChallenge />} />
      <Route path="/my-challenges" element={<MyChallenge />} />
      <Route path="/public-challenges" element={<PublicChallenge />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/settings" element={<Setting />} />

      {/* Admin routes */}
      {user?.role === "ADMIN" && (
        <>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users/banlist" element={<UserBanlist />} />
          <Route path="/admin/users/:userId" element={<UserDetails />} />
        </>
      )}

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
