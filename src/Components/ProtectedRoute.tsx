import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GlobalContext } from "../context/global-context";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

const ProtectedRoute: React.FC = () => {
 
  const location = useLocation();

  const { currentUser, loading } = useContext(GlobalContext);
  if(loading) return <div>Loading...</div>;
  if(!currentUser) return <Navigate to="/signin" state={{ from: location }} replace  />;

  if(currentUser) return <Outlet />;
};

export default ProtectedRoute;
