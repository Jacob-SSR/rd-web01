// src/App.jsx
import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useStore } from "./stores/userStore";

function App() {
  const { getCurrentUser } = useStore();
  
  useEffect(() => {
    // Try to authenticate user with stored token on app load
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <div className="min-h-screen bg-base-100">
      <AppRoutes />
    </div>
  );
}

export default App;