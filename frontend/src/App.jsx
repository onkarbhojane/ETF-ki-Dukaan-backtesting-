// ParentComponent.jsx
import React from "react";
import UserDashboard from "./UserDashboard";
const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <UserDashboard />
    </div>
  );
};

export { App };