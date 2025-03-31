// src/App.jsx
import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useStore } from "./stores/userStore";
import Layout from "./layouts/layout";

function App() {
  const { getCurrentUser, isAuthenticated } = useStore();
  
  useEffect(() => {
    // Try to authenticate user with stored token on app load
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Always render Layout, which will contain the sidebar and navigation */}
      <Layout>
        <AppRoutes />
      </Layout>
    </div>
  );
}

export default App;