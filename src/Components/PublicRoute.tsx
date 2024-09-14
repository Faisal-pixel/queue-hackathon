import React, { useContext, useEffect} from "react";
import {  Outlet, useLocation, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/global-context";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

const PublicRoute: React.FC = () => {
 
  const location = useLocation();
  const navigate = useNavigate();

  const { allowAccess } = useContext(GlobalContext);

  
  useEffect(() => {
    const from = location.state?.from.pathname;
    if(allowAccess && from && from !== location.pathname) navigate(from, {replace: true});

  }, [allowAccess, location, navigate]);

  if (!allowAccess) {
    // setPageState("login");
    return <Outlet />;
  };
};

export default PublicRoute;
