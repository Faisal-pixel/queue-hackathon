import { NavLink, NavLinkRenderProps } from "react-router-dom";
import { signOutUser } from "../utils/firebase";

// Define the type for the NavLink component props

import { useState } from 'react';

export default function Sidebar() {
 const [isOpen, setIsOpen] = useState(true);
 const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => { 
      localStorage.removeItem("staffList");
      signOutUser();
    }

  return (
    <div className="flex">
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* {HEADER} */}
        <div className="flex items-center justify-between p-4 bg-orange-400">
          <h1 className="text-white text-xl font-bold text-center">QueueNot</h1>
        </div>

        {/* {NAVIGATION TO PAGES} */}
        <nav className="flex-1 p-4">
          <ul className="space-y-10 pt-10">
            <NavLink
              to="/admin-queue"
              className={({ isActive }: NavLinkRenderProps) =>
                `group flex items-center transition ${isActive ? 'text-orange-500' : ''}`
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

        {/* Footer */}
        <div className="p-4 border-t">
          <ul className="space-y-4">
            <li>
              <a className="lg:space-x-2 text-gray-600 hover:text-orange-500 gap-3">
                <i className="fas fa-bell"></i>
                <span>Notifications</span>
              </a>
            </li>
            <NavLink
              to="/admin-queue/settings"
              className={({ isActive }: NavLinkRenderProps) =>
                `group flex items-center transition ${isActive ? 'text-orange-500' : ''}`
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
              <a className="text-gray-600 hover:text-orange-500">
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
      {/* Toggle Button always visible */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 ${isOpen ? 'left-64' : 'left-4'} text-white bg-orange-400 p-2 rounded-full focus:outline-none transition-all duration-300 lg:invisible`}
      >
        <i className={`fas ${isOpen ? 'fa-angle-left' : 'fa-angle-right'}`}></i>
      </button>
    </div>
  );
}

