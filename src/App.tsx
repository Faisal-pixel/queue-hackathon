import { Route, Routes } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import AdminQueue from "./Components/Admin/Queue";
import Queue from "./Components/Users/Queue";
import Landing from "./Components/Landing";
import Settings from "./Components/Pages/Settings";
import { SignIn } from "./Components/Pages/SignIn";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import NotAnEmployee from "./Components/Pages/NotAnEmployee";
import { Toaster } from "./Components/ui/toaster";


const App: React.FC = () => {
  
 
  return (
    <div className="min-h-screen bg-orange-100">
      <Routes>
        {/* this is the route the customer will see */}
        <Route path="signin" element={<SignIn />} />

        <Route path="/" element={<PublicRoute />}>
          <Route path="queue/:smeEmail" element={<Queue />} />
          <Route index element={<Landing />} />
        </Route>

        {/* this is the admin route */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/not-an-employee" element={<ProtectedRoute />}>
          <Route index element={<NotAnEmployee />} />
        </Route>

        <Route  element={<ProtectedRoute />}>
          <Route
            path="/admin-queue"
            element={
              <div className="min-h-screen justify-center flex">
                <Sidebar />
                <AdminQueue />
              </div>
            }
            
          />

          <Route
            path="/settings"
            element={
              <div className="min-h-screen">
                <Sidebar />
                <Settings />
              </div>
            }
          />
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
