import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const RequireAuth = ({requiredPermissions}) => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log(auth.permissions)
    console.log(requiredPermissions)
    return (

        requiredPermissions?
            auth?.permissions?.find(perm => requiredPermissions?.includes(perm))
            ? <Outlet />
            : auth?.email
            ? <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/" state={{ from: location }} replace />
        :auth?.email
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />

    );
}

export default RequireAuth;