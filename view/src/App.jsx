import Login from "./pages/Login.jsx";
import "react-toastify/dist/ReactToastify.css";
import UserEntry from "./pages/UserEntry.jsx";
import Resources from "./pages/Resources.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile";
import { Route, Routes, useLocation } from "react-router-dom";
import Transcript from "./pages/Transcript.jsx";
import {
  HOMEPAGE,
  TRANSCRIPT,
  USER_ENTRY,
  RESOURCES,
  PROFILE,
  CONTEST,
  USERS,
} from "../src/urls/frontend_urls";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";
import Contest from "./pages/Contest.jsx";
import Users from "./pages/Users.jsx";

function App() {
  const location = useLocation();

  if (location.pathname !== "/") {
    return (
      <div>
        <NavBar />
        <Routes>
          <Route
            path={HOMEPAGE}
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path={USER_ENTRY}
            element={
              <ProtectedRoute>
                <UserEntry />
              </ProtectedRoute>
            }
          />
          <Route
            path={RESOURCES}
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route
            path={TRANSCRIPT}
            element={
              <ProtectedRoute>
                <Transcript />
              </ProtectedRoute>
            }
          />
          <Route
            path={PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path={CONTEST}
            element={
              <ProtectedRoute>
                <Contest />
              </ProtectedRoute>
            }
          />
          <Route
            path={USERS}
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer position="bottom-center" limit={1} autoClose={2000} />
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
      <ToastContainer position="top-center" limit={1} autoClose={2000} />
    </div>
  );
}

export default App;
