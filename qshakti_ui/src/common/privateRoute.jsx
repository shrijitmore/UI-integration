// src/components/PrivateRoute.jsx
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (isAuthenticated && location.pathname !== "/") {
      sessionStorage.setItem("lastRoute", location.pathname);
    }
  }, [location]);

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
