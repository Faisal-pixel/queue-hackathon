import { useContext, useEffect, useState } from "react";
import { TCustomer } from "../../types";
import { GlobalContext } from "../../context/global-context";


const TicketTable = () => {
  //   const [newCustomer, setNewCustomer] = useState<Omit<TCustomer, "ticketNo">>({
  //     customerName: "",
  //     customerEmail: "",
  //     customerPhone: "",
  //     status: "in process",
  //     ready: 0,
  //     notified: false,
  //   });

  const { currentSME } = useContext(GlobalContext);
  const [tickets, setTickets] = useState<TCustomer[]>([]);

    // Load tickets from SME context
    useEffect(() => {
        if (currentSME) {
            setTickets(currentSME.queue || []);
        }
    }, [currentSME]);
  //   const [isAddingTicket, setIsAddingTicket] = useState(false);


  const handleDeleteTicket = (ticketNoToDel: number) => {
    setTickets((prevTickets) => {
      const filteredTickets = prevTickets.filter(
        (ticket) => ticket.ticketNo !== ticketNoToDel
      );
      // Reorder IDs
      return filteredTickets.map((ticket, index) => ({
        ...ticket,
        ticketNo: index + 1, // Assign new ID
      }));
    });
  };

  const formatId = (id: number) => id.toString().padStart(3, "0");


  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 pt-5">Queue Management</h1>
      

      {tickets.length === 0 && (
        <div>
          <p>No Customers yet.</p>
          
        </div>
      )}

      {tickets.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto min-w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-center">#</th>
              <th className="border px-4 py-2 text-center">Name</th>
              <th className="border px-4 py-2 text-center">Email</th>
              <th className="border px-4 py-2 text-center">Phone</th>
              <th className="border px-4 py-2 text-center">Ready In</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.ticketNo} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-center">
                  {formatId(ticket.ticketNo as number)}
                </td>
                <td className="border px-4 py-2 break-words">

                  <p>{ticket.customerName}</p>
                </td>
                <td className="border px-4 py-2 break-words">
                  <p>{ticket.customerEmail}</p>
                </td>
                <td className="border px-4 py-2 break-words">
                  <p>{ticket.customerPhone}</p>
                </td>
          
                <td className="border px-4 py-2 text-center break-words">
                 

                  <p>{ticket.ready.toDate().toLocaleString()}</p>
                </td>
                <td className="border px-4 py-2 text-center break-words">
                  <button
                    onClick={() =>
                      handleDeleteTicket(ticket.ticketNo as number)
                    }
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
      )}
    </div>
  );
};

export default TicketTable;
