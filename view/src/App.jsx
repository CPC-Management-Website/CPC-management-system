import React from "react";
import Login from "./pages/Login.jsx";
import "react-toastify/dist/ReactToastify.css";
import UserEntry from "./pages/UserEntry.jsx";
import Resources from "./pages/Resources.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile";
import { Route, Routes, Navigate } from "react-router-dom";
import Transcript from "./pages/Transcript.jsx";
import {
  HOMEPAGE,
  TRANSCRIPT,
  USER_ENTRY,
  RESOURCES,
  PROFILE,
  CONTEST,
  USERS,
  SIGNUP,
  LOGIN,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from "../src/urls/frontend_urls";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";
import Contest from "./pages/Contest.jsx";
import Users from "./pages/Users.jsx";
import SignUp from "./pages/SignUp.jsx";
import Forgot_Password from "./pages/ForgotPassword.jsx";
import NotFound from "./pages/NotFound.jsx";
import {
  ADD_CONTESTS,
  ADD_USERS,
  VIEW_RESOURCES,
  VIEW_TRAINEES,
  VIEW_MY_TRANSCRIPT,
  VIEW_ADMINS,
  VIEW_MENTORS,
  UPDATE_CONTESTS,
  DELETE_CONTESTS,
  VIEW_MENTEES,
} from "./permissions/permissions";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to={HOMEPAGE} />} />
        <Route path={LOGIN} element={<Login />} />
        <Route path={HOMEPAGE} element={<Home />} />
        <Route
          path={USER_ENTRY}
          element={
            <ProtectedRoute allowedPermissions={[ADD_USERS]}>
              <UserEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path={RESOURCES}
          element={
            <ProtectedRoute allowedPermissions={[VIEW_RESOURCES]}>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
          path={TRANSCRIPT}
          element={
            <ProtectedRoute allowedPermissions={[VIEW_MY_TRANSCRIPT]}>
              <Transcript />
            </ProtectedRoute>
          }
        />
        <Route
          path={PROFILE}
          element={
            <ProtectedRoute restrict={false}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={CONTEST}
          element={
            <ProtectedRoute
              allowedPermissions={[
                ADD_CONTESTS,
                UPDATE_CONTESTS,
                DELETE_CONTESTS,
              ]}
            >
              <Contest />
            </ProtectedRoute>
          }
        />
        <Route
          path={USERS}
          element={
            <ProtectedRoute
              allowedPermissions={[
                VIEW_ADMINS,
                VIEW_MENTORS,
                VIEW_TRAINEES,
                VIEW_MENTEES,
              ]}
            >
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path={SIGNUP} element={<SignUp />} />
        <Route path={FORGOT_PASSWORD} element={<Forgot_Password />} />
        <Route path={RESET_PASSWORD} element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="bottom-center" limit={1} autoClose={5000} />
    </div>
  );
}

export default App;
