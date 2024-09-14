import { NavLink, NavLinkRenderProps } from "react-router-dom";
import { signOutUser } from "../utils/firebase";

// Define the type for the NavLink component props


export default function Sidebar() {

  const handleSignOut = () => { 
      localStorage.removeItem("staffList");
      signOutUser();
    }

  return (
    <div className="flex flex-col bg-white shadow-xl h-screen max-w-lg">

      {/* {HEADER} */}
      <div className="flex items-center justify-between p-4 bg-orange-400">
        <h1 className="text-white text-xl font-bold text-center">QueueNot </h1>
        <button className="text-white focus:outline-none">
          <i className="fas fa-angle-left"></i>
        </button>
      </div>

      {/* {NAVIGATION TO PAGES} */}
      <nav className="flex-1 p-4">
        <ul className="space-y-10 pt-10">
          <NavLink
            to="/admin-queue"
            className={({ isActive }: NavLinkRenderProps) =>
              `group flex items-center transition  ${isActive ? "text-orange-500" : ""
              }`
            }
          >
            <li>
              <a className="space-x-1 text-gray-600 hover:text-orange-400">
                <i className="fas fa-truck"></i>
                <span className="text-xl">Queue</span>
              </a>
            </li>
          </NavLink>
        </ul>
      </nav>

      {/* Footer*/}
      <div className="p-4 border-t">
        <ul className="space-y-4">
          <li>
            <a className="lg:space-x-2 text-gray-600 hover:text-orange-500 gap-3">
              <i className="fas fa-bell"></i>
              <span>Notifications</span>
            </a>
          </li>
          <NavLink
          to="/settings"
          className={({ isActive }: NavLinkRenderProps) =>
            `group flex items-center transition  ${isActive ? "text-orange-500" : ""
            }`
          }
          >
          <li>
            <a className="lg:space-x-2 text-gray-600 hover:text-orange-500">
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </a>
          </li>
          </NavLink>
          <li>
            <a className=" text-gray-600 hover:text-orange-500">
              <span className="break-words">Feedback</span>
            </a>
          </li>
        </ul>
      </div>

      {/* SignOut Button */}
      <div className="p-4">
        <button className="w-full bg-orange-500 text-white p-2 rounded-lg" onClick={handleSignOut}>Sign Out</button>
      </div>
    </div>
  )
}

