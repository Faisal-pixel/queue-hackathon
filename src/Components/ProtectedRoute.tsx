import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GlobalContext } from "../context/global-context";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

const ProtectedRoute: React.FC = () => {
 
  const location = useLocation();

  const { allowAccess } = useContext(GlobalContext);
  if(!allowAccess) return <Navigate to="/signin" state={{ from: location }} replace  />;

  if(allowAccess) return <Outlet />;
};

export default ProtectedRoute;
