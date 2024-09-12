import './App.css'
import Sidebar from "./Components/Sidebar"

function App() {

  return (
    // <>
    // <Sidebar/>
    // </>
    <div className="flex">
      <Sidebar/>
      <div>
        {/* Main content*/}
        <h1 className="text-2xl font-bold">Main Content Area</h1>
      </div>
    </div>
  )
}

export default App
