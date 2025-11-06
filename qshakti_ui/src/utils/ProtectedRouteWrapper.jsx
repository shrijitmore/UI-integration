import React from "react";
import { Navigate } from "react-router-dom";
import { hasPermission } from "./permissions";

const ProtectedRouteWrapper = ({ screen, action = "view", children }) => {
  const allowed = hasPermission(screen, action);

  if (!allowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRouteWrapper;
