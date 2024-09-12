

export default function Sidebar(){
  
    return (
        <div className="flex flex-col h-screen w-[25%] bg-white shadow-xl">

            {/* {HEADER} */}
        <div className="flex items-center justify-between p-4 bg-orange-500">
          <h1 className="text-white text-xl font-bold text-center">QueueNot </h1>
          <button className="text-white focus:outline-none">
            <i className="fas fa-angle-left"></i>
          </button>
        </div>

        {/* {NAVIGATION TO PAGES} */}
        <nav className="flex-1 p-4">
          <ul className="space-y-8">
            <li>
              <a className="flex items-center  text-gray-600 hover:text-orange-500">
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a className="flex items-center  text-gray-600 hover:text-orange-500">
                <i className="fas fa-truck"></i>
                <span>Queue</span>
              </a>
            </li>
          </ul>
        </nav>
  
        {/* Footer*/}
        <div className="p-4 border-t">
          <ul className="space-y-4">
            <li>
              <a className="flex items-center text-gray-600 hover:text-orange-500">
                <i className="fas fa-bell"></i>
                <span>Notifications</span>
              </a>
            </li>
            <li>
              <a className="flex items-center text-gray-600 hover:text-orange-500">
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a className="flex items-center text-gray-600 hover:text-orange-500">
                <span>Feedback/Complaints</span>
              </a>
            </li>
          </ul>
        </div>
        
        {/* SignOut Button */}
        <div className="p-4">
          <button className="w-full bg-orange-500 text-white p-2 rounded-lg">Sign Out</button>
        </div>
      </div>
  )
}

