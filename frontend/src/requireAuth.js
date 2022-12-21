import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import { UNAUTHORIZED } from "./frontend_urls";

const RequireAuth = ({requiredPermissions}) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (


        auth?.permissions?.find(perm => requiredPermissions?.includes(perm))
        ? <Outlet />
        : auth?.email
            ? <Navigate to= {UNAUTHORIZED} state={{ from: location }} replace />
            : <Navigate to="/" state={{ from: location }} replace />
    );
}

export default RequireAuth;