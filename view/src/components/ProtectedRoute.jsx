import React, { useContext } from "react";
import { Store } from "../context/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LOGIN } from "../urls/frontend_urls";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      navigate(LOGIN);
    }
  }, [navigate, userInfo]);

  return userInfo ? children : null;
}
