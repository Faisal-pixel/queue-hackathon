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

// import { Ticket } from "./types";
// import {
//   addQueueToSME,
//   checkIfCurrentUserIsAnEmployee,
// } from "./utils/firebase/firebase";

// type Ticket = {
//   id: string; // Change id type to string for formatted IDs
//   name: string;
//   status: string;
//   ready: string;
//   email?: string; // Optional email field
//   phone?: string; // Optional phone field
// };

const App: React.FC = () => {
  // const [queue, setQueue] = useState<TCustomer[]>(() => {
  //   const storedTickets = localStorage.getItem("tickets");
  //   return storedTickets ? JSON.parse(storedTickets) : [];
  // });

  // const handleIdChange = (oldId: string | number, newId: string | number) => {
  //   setQueue((prevTickets) =>
  //     prevTickets.map((ticket) =>
  //       ticket.ticketNo === oldId ? { ...ticket, id: newId } : ticket
  //     )
  //   );
  // };

  // const handleNameChange = (id: string | number, newName: string) => {
  //   setQueue((prevTickets) =>
  //     prevTickets.map((ticket) =>
  //       ticket.ticketNo === id ? { ...ticket, name: newName } : ticket
  //     )
  //   );
  // };

  // const handleEmailChange = (id: number, newEmail: string) => {
  //   setQueue((prevTickets) =>
  //     prevTickets.map((ticket) =>
  //       ticket.ticketNo === id ? { ...ticket, email: newEmail } : ticket
  //     )
  //   );
  // };

  // const handlePhoneChange = (id: number, newPhone: string) => {
  //   setQueue((prevTickets) =>
  //     prevTickets.map((ticket) =>
  //       ticket.ticketNo === id ? { ...ticket, phone: newPhone } : ticket
  //     )
  //   );
  // };

  // const handleStatusChange = (id: number, newStatus: string) => {
  //   setQueue((prevTickets) =>
  //     prevTickets.map((ticket) =>
  //       ticket.ticketNo === id ? { ...ticket, status: newStatus } : ticket
  //     )
  //   );
  // };

  // const handleReadyChange = (id: number, newReady: number) => {
  //   setQueue((prevTickets) =>
  //     prevTickets.map((ticket) =>
  //       ticket.ticketNo === id ? { ...ticket, ready: newReady } : ticket
  //     )
  //   );
  // };

  // const handleAddNewTicket = (newTicket: TCustomer) => {
  //   setQueue((prevTickets) => [...prevTickets, newTicket]);
  //   const setQueueToDB = async () => {
  //     try {
  //       const isEmployee = await checkIfCurrentUserIsAnEmployee(userAuth);

  //       if (isEmployee) {
  //         await addQueueToSME(queue, isEmployee);
  //       } else {
  //         await addQueueToSME(queue, userAuth.email);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   setQueueToDB();
  // };

  // const handleDeleteTicket = (id: number) => {
  //   setQueue((prevTickets) => {
  //     const filteredTickets = prevTickets.filter((ticket) => ticket.ticketNo !== id);
  //     // Reorder IDs
  //     return filteredTickets.map((ticket, index) => ({
  //       ...ticket,
  //       id: String(index + 1).padStart(3, "0"), // Assign new ID
  //     }));
  //   });
  // };

  // // Save tickets to localStorage whenever they change
  // useEffect(() => {
  //   localStorage.setItem("tickets", JSON.stringify(queue));
  // }, [queue]);

  // If there is no user Auth, return the sign in page
  // If there is user Auth, then allow to access the admin-staff page
  // If user Auth is an employee, then allow to access dashboard
  // If not, show an error that the user is not an employee
  // If user Auth is an SME, then allow to access the dashboard
  // If not, show an error that the user doesnt exist as an sme

  return (
    <div className="min-h-screen bg-orange-100">
      <Routes>
        {/* this is the route the customer will see */}
        <Route path="signin" element={<SignIn />} />
        <Route path="/" element={<PublicRoute />}> 
        <Route path="queue" element={<Queue />} />
        <Route index element={<Landing />} />
        </Route>

        {/* this is the admin route */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/not-an-employee" element={<ProtectedRoute />}>
        <Route index element={<NotAnEmployee />} /></Route>
        <Route path="/admin-queue" element={<ProtectedRoute />}>
          <Route
            index
            element={
              <div className="min-h-screen justify-center flex">
                <Sidebar />
                <AdminQueue />
              </div>
            }
            
          />

          <Route
            path="settings"
            element={
              <div className="min-h-screen">
                <Sidebar />
                <Settings />
              </div>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
