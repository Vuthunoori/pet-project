// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { sessionState } from "../atoms/cartstate";

const ProtectedRoute = ({ element }) => {
  const session = useRecoilValue(sessionState);
  if (!session) {
    return <Navigate to="/" replace />;
  }
  return element;
};

export default ProtectedRoute;
