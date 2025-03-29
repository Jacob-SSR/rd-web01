import React from 'react';
import { useRoutes } from 'react-router';
import ChallengePage from '../pages/ChallengePage';
import DailyChallenge from '../pages/DailyChallene'; // Note: File has typo, should be fixed
import MyChallenge from '../pages/MyChallenge';
import PublicChallenge from '../pages/PubilcChallenge'; // Note: File has typo, should be fixed
import Setting from '../pages/Setting';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/admin/AdminDasboard';
import UserBanlist from '../pages/admin/UsarBanlist';
import UserDetails from '../pages/admin/UserDetails';
import { useStore } from '../stores/userStore';

// Remove the circular dependency - don't import App here

function AppRoutes() {
  const { isAuthenticated, user } = useStore();
  
  // Define routes based on authentication state
  const routes = [
    // Public routes
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ];
  
  // Add protected routes if user is authenticated
  if (isAuthenticated) {
    routes.push(
      { path: "/", element: <ChallengePage /> },
      { path: "/daily-challenge", element: <DailyChallenge /> },
      { path: "/my-challenges", element: <MyChallenge /> },
      { path: "/public-challenges", element: <PublicChallenge /> },
      { path: "/settings", element: <Setting /> }
    );
    
    // Add admin routes if user has admin role
    if (user?.role === 'admin') {
      routes.push(
        { path: "/admin/dashboard", element: <AdminDashboard /> },
        { path: "/admin/users/banlist", element: <UserBanlist /> },
        { path: "/admin/users/:userId", element: <UserDetails /> }
      );
    }
  } else {
    // Redirect all other routes to login if not authenticated
    routes.push({ path: "*", element: <Login /> });
  }
  
  // Use the routes configuration with useRoutes hook
  const routeElement = useRoutes(routes);
  
  return routeElement;
}

export default AppRoutes;