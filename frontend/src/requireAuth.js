import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const RequireAuth = ({requiredPermissions}) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (


        // auth?.permissions?.find(perm => requiredPermissions?.includes(role))
        // ? <Outlet />
        // : auth?.user
        //     ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        //     : <Navigate to="/login" state={{ from: location }} replace />


        
        auth?.email
            ? <Outlet />
            : <Navigate to="/" state={{ from: location }} replace />
    );
}

export default RequireAuth;