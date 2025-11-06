import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { setAuthToken } from "../store/slices/auth/authSlice";

const PublicRoute = ({ children }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token && !accessToken) {
      dispatch(setAuthToken(token));
    }
  }, [accessToken, dispatch]);

  if (accessToken && location?.pathname !== "/") {
    return <Navigate to="/masterDashboard" replace />;
  }

  return children;
};

export default PublicRoute;
