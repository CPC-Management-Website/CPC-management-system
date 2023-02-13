import Login from "./pages/Login.jsx";
import "react-toastify/dist/ReactToastify.css";
import UserEntry from "./pages/UserEntry.jsx";
import Resources from "./pages/Resources.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Transcript from "./pages/Transcript.jsx";
import {
  HOMEPAGE,
  TRANSCRIPT,
  USER_ENTRY,
  RESOURCES,
  PROFILE,
  CONTEST,
  USERS,
  REGISTER,
  LOGIN,
} from "../src/urls/frontend_urls";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";
import Contest from "./pages/Contest.jsx";
import Users from "./pages/Users.jsx";
import Register from "./pages/Register"

function App() {
  const location = useLocation();
    return (
      <div>
        <NavBar />
        <Routes>
          <Route path="/" 
            element={ <Navigate to={HOMEPAGE} /> }
          />
          <Route path={LOGIN} 
            element={
              <Login />
            }
          />
          <Route
            path={HOMEPAGE}
            element={
                <Home />
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
          <Route
            path={REGISTER}
            element={
                <Register />
            }
          />
          <Route
            path="*"
            element={
              <div className="flex min-h-[90vh] justify-center font-semibold items-center text-3xl lg:text-5xl">
                Page not found 404
              </div>
            }
          />
        </Routes>
        <ToastContainer position="bottom-center" limit={1} autoClose={2000} />
      </div>
    );
}

export default App;
