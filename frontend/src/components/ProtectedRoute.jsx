import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;       // not logged in
  if (user.role !== "admin") return <Navigate to="/" />; // not admin

  return children; // admin can see the page
}
