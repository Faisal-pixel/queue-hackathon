import { Route, Routes } from "react-router-dom";
import SigninAsAdmin from './Components/Sign_In/SigninForAdmin'
import Sidebar from "./Components/Sidebar"
import CompanyName from './Components/Sign_In/CompanyName'
import AdminQueue from "./Components/Admin/Queue"
import Queue from "./Components/Users/Queue"
import Landing from "./Components/Landing";
import Settings from "./Components/Pages/Settings";
import { SignIn } from "./Components/Pages/SignIn";





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
    <div  className="min-h-screen bg-orange-100">

      <Routes>
        {/* this is the route the customer will see */}
        <Route path="/queue" element={<Queue />} />
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />

        {/* <Route path="/signin" element={<PublicRoute />}>
          <Route index element={<SignIn />} />
          <Route path="/signin/ticket-page" element={<Userface />} />

        </Route> */}

        {/* this is the admin route */}

        {/* <Route element={<ProtectedRoute />}> */}
          <Route
          path="/admin-queue"
            element={
              <div className="min-h-screen justify-center flex">
                <Sidebar />
                <AdminQueue 
        
                />
              </div>
            }
          />

          <Route
            path="/sign-in-as-admin"
            element={
              <div className="flex min-h-screen">
                <Sidebar />
                <SigninAsAdmin />
              </div>
            }
          /> 

          <Route
          path="/Company-name"
            element={
              <div className="flex min-h-screen">
                <Sidebar />
                <CompanyName />
              </div>
            }
          />

          <Route
            path="/settings"
            element={
              <div className="md:flex min-h-screen justify-center">
                <Sidebar />
                <Settings/>
              </div>
            }
          />

        {/* </Route> */}
      </Routes>
    
    </div>
   
  );
};

export default App;
