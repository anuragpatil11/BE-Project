// components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const roleBasedRoutes = {
  Student: ["/student-dashboard", "/student-dashboard/summarize-compliances"],
  Warden: [
    "/warden-dashboard/student-compliances",
    "/warden-dashboard/student-uploaded-compliances",
    "/warden-dashboard/upload-student-compliances",
    "/warden-dashboard/student-list",
    "/warden-dashboard/summarize-compliances",
  ],
  Admin: [
    "/admin-dashboard",
    "/admin-dashboard/warden-compliance",
    "/admin-dashboard/teacher-compliance",
    "/admin-dashboard/student-compliance",
  ],
};

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, userRole } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login-Page" replace />;
  }

  const currentPath = location.pathname;
  const allowedRoutes = roleBasedRoutes[userRole] || [];

  if (!allowedRoutes.includes(currentPath)) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

export default ProtectedRoute;
