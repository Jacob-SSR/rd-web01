import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useStore } from "./stores/userStore";
import Layout from "./layouts/layout"; // Import the new Layout component instead of Navbar

function App() {
  const { getCurrentUser } = useStore();
  
  useEffect(() => {
    // Try to authenticate user with stored token on app load
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Use Layout instead of Navbar to render AppRoutes */}
      <Layout>
        <AppRoutes />
      </Layout>
    </div>
  );
}

export default App;