import React, { useContext, useEffect, useState } from "react";
import { TCustomer } from "../../types";
import { GlobalContext } from "../../context/global-context";

// type TCustomer = {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   status: string;
//   ready: number;
// };

// type TicketTableProps = {
// };

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
            setTickets(currentSME.queue);
        }
    }, [currentSME]);
  //   const [isAddingTicket, setIsAddingTicket] = useState(false);

  // Decrement the ready time every minute
  // useEffect(() => {
  //     const interval = setInterval(() => {
  //         const updatedTickets = tickets.map((ticket) => {
  //             if (ticket.ready as number > 0) {
  //                 return { ...ticket, ready: ticket.ready as number - 1 };
  //             }
  //             return ticket;
  //         });

  //         updatedTickets.forEach((ticket) => onReadyChange(ticket.id as number, ticket.ready as number));
  //     }, 60000); // 1 minute

  //     return () => clearInterval(interval);
  // }, [tickets, onReadyChange]);

  // const handleNewTicketChange = (field: keyof Omit<TCustomer, 'id'>, value: string | number) => {
  //     setNewCustomer((prev) => ({ ...prev, [field]: value }));
  // };

  // const handleAddNewTicket = () => {
  //     if (newCustomer.name && newCustomer.email && newCustomer.phone) {
  //         const newId = getNextId();
  //         onAddNewTicket({ ...newCustomer, id: newId });
  //         setNewCustomer({ name: '', email: '', phone: '', status: 'in process', ready: 0 });
  //         setIsAddingTicket(false);
  //     }
  // };

  // const getNextId = () => {
  //     const ids = tickets.map((ticket) => ticket.id as number);
  //     const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  //     return maxId + 1;
  // };

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

  //   const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  //   const isValidPhone = (phone: string) => /^\d+$/.test(phone);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 pt-5">Queue Management</h1>
      {/* {tickets.length > 0 && (
                <button
                    onClick={() => setIsAddingTicket(!isAddingTicket)}
                    className="bg-orange-500 text-white px-4 py-2 mb-4"
                >
                    {isAddingTicket ? 'Cancel' : 'Add New Ticket'}
                </button>
            )} */}

      {/*   {isAddingTicket && (
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newCustomer.name}
                        onChange={(e) => handleNewTicketChange('name', e.target.value)}
                        className="border p-1"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newCustomer.email}
                        onChange={(e) => handleNewTicketChange('email', e.target.value)}
                        className={`border p-1 ${!isValidEmail(newCustomer.email as string) ? 'border-red-500' : ''}`}
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={newCustomer.phone}
                        onChange={(e) => handleNewTicketChange('phone', e.target.value)}
                        className={`border p-1 ${!isValidPhone(newCustomer.phone as string) ? 'border-red-500' : ''}`}
                    />
                    {/* <select
                        value={newTicket.status}
                        onChange={(e) => handleNewTicketChange('status', e.target.value)}
                        className="border p-1"
                    >
                        <option value="in process">in process</option>
                        <option value="Ready">Ready</option>
                        <option value="declined">declined</option>
                    </select> 
                    <input
                        type="number"
                        placeholder="Ready Time in minutes"
                        value={newCustomer.ready}
                        onChange={(e) => handleNewTicketChange('ready', parseInt(e.target.value, 10))}
                        className="border p-1"
                    />
                    <button
                        onClick={handleAddNewTicket}
                        className="bg-orange-500 text-white px-4 py-2"
                        disabled={!isValidEmail(newCustomer.email as string) || !isValidPhone(newCustomer.phone as string)}
                    >
                        Add Ticket
                    </button>
                </div>
            )} */}

      {tickets.length === 0 && (
        <div>
          <p>No Customers yet.</p>
          {/* <button
                        onClick={() => setIsAddingTicket(true)}
                        className="bg-orange-500 text-white px-4 py-2"
                    >
                        Add Ticket
                    </button> */}
        </div>
      )}

      {tickets.length > 0 && (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-center">#</th>
              <th className="border px-4 py-2 text-center">Name</th>
              <th className="border px-4 py-2 text-center">Email</th>
              <th className="border px-4 py-2 text-center">Phone</th>
              {/* <th className="border px-4 py-2 text-center">Status</th> */}
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
                <td className="border px-4 py-2">
                  {/* <input
                                        type="text"
                                        value={ticket.cus}
                                        onChange={(e) => onNameChange(ticket.id as number, e.target.value)}
                                        className="border p-1 w-full"
                                    /> */}

                  <p>{ticket.customerName}</p>
                </td>
                <td className="border px-4 py-2">
                  {/* <input
                                        type="email"
                                        value={ticket.email}
                                        onChange={(e) => onEmailChange(ticket.id as number, e.target.value)}
                                        className={`border p-1 w-full ${!isValidEmail(ticket.email as string) ? 'border-red-500' : ''}`}
                                    /> */}
                  <p>{ticket.customerEmail}</p>
                </td>
                <td className="border px-4 py-2">
                  {/* <input
                                        type="tel"
                                        value={ticket.phone}
                                        onChange={(e) => onPhoneChange(ticket.id as number, e.target.value)}
                                        className={`border p-1 w-full ${!isValidPhone(ticket.phone as string) ? 'border-red-500' : ''}`}
                                    /> */}
                  <p>{ticket.customerPhone}</p>
                </td>
                {/* <td className="border px-4 py-2 text-center">
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => onStatusChange(ticket.id as number, e.target.value)}
                                        className="border p-1"
                                    >
                                        <option value="in process">in process</option>
                                        <option value="Ready">Ready</option>
                                        <option value="declined">declined</option>
                                        <option value="Out of Store">Out of store</option>
                                    </select>
                                </td> */}
                <td className="border px-4 py-2 text-center">
                  {/* <input
                                        type="number"
                                        value={ticket.ready}
                                        onChange={(e) => onReadyChange(ticket.id as number, parseInt(e.target.value, 10))}
                                        className="border p-1 w-full text-center"
                                    /> */}

                  <p>{ticket.ready.toDate().toLocaleString()}</p>
                </td>
                <td className="border px-4 py-2 text-center">
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
      )}
    </div>
  );
};

export default TicketTable;
