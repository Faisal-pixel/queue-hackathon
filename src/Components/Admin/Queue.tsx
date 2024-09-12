import React, { useState, useEffect } from 'react';
import { Ticket } from '../types';

// type Ticket = {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   status: string;
//   ready: number;
// };

type TicketTableProps = {
    tickets: Ticket[];
    onIdChange: (oldId: number | string, newId: number | string) => void;
    onNameChange: (id: number | string, newName: string) => void;
    onEmailChange: (id: number, newEmail: string) => void;
    onPhoneChange: (id: number, newPhone: string) => void;
    onStatusChange: (id: number, newStatus: string) => void;
    onReadyChange: (id: number, newReady: number) => void;
    onAddNewTicket: (newTicket: Ticket) => void;
    onDeleteTicket: (id: number) => void;
};

const TicketTable: React.FC<TicketTableProps> = ({
    tickets,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onIdChange,
    onNameChange,
    onEmailChange,
    onPhoneChange,
    onStatusChange,
    onReadyChange,
    onAddNewTicket,
    onDeleteTicket,
}) => {
    const [newTicket, setNewTicket] = useState<Omit<Ticket, 'id'>>({
        name: '',
        email: '',
        phone: '',
        status: 'in process',
        ready: 0,
    });
    const [isAddingTicket, setIsAddingTicket] = useState(false);

    // Decrement the ready time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTickets = tickets.map((ticket) => {
                if (ticket.ready as number > 0) {
                    return { ...ticket, ready: ticket.ready as number - 1 };
                }
                return ticket;
            });

            updatedTickets.forEach((ticket) => onReadyChange(ticket.id as number, ticket.ready as number));
        }, 60000); // 1 minute

        return () => clearInterval(interval);
    }, [tickets, onReadyChange]);

    const handleNewTicketChange = (field: keyof Omit<Ticket, 'id'>, value: string | number) => {
        setNewTicket((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddNewTicket = () => {
        if (newTicket.name && newTicket.email && newTicket.phone) {
            const newId = getNextId();
            onAddNewTicket({ ...newTicket, id: newId });
            setNewTicket({ name: '', email: '', phone: '', status: 'in process', ready: 0 });
            setIsAddingTicket(false);
        }
    };

    const getNextId = () => {
        const ids = tickets.map((ticket) => ticket.id as number);
        const maxId = ids.length > 0 ? Math.max(...ids) : 0;
        return maxId + 1;
    };

    const formatId = (id: number) => id.toString().padStart(3, '0');

    const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    const isValidPhone = (phone: string) => /^\d+$/.test(phone);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4 pt-5">Queue Management</h1>
            {tickets.length > 0 && (
                <button
                    onClick={() => setIsAddingTicket(!isAddingTicket)}
                    className="bg-orange-500 text-white px-4 py-2 mb-4"
                >
                    {isAddingTicket ? 'Cancel' : 'Add New Ticket'}
                </button>
            )}

            {isAddingTicket && (
                <div className="flex gap-2 mt-2">
                    <input
                        type="text"
                        placeholder="Name"
                        value={newTicket.name}
                        onChange={(e) => handleNewTicketChange('name', e.target.value)}
                        className="border p-1"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newTicket.email}
                        onChange={(e) => handleNewTicketChange('email', e.target.value)}
                        className={`border p-1 ${!isValidEmail(newTicket.email as string) ? 'border-red-500' : ''}`}
                    />
                    <input
                        type="tel"
                        placeholder="Phone"
                        value={newTicket.phone}
                        onChange={(e) => handleNewTicketChange('phone', e.target.value)}
                        className={`border p-1 ${!isValidPhone(newTicket.phone as string) ? 'border-red-500' : ''}`}
                    />
                    {/* <select
                        value={newTicket.status}
                        onChange={(e) => handleNewTicketChange('status', e.target.value)}
                        className="border p-1"
                    >
                        <option value="in process">in process</option>
                        <option value="Ready">Ready</option>
                        <option value="declined">declined</option>
                    </select> */}
                    <input
                        type="number"
                        placeholder="Ready Time in minutes"
                        value={newTicket.ready}
                        onChange={(e) => handleNewTicketChange('ready', parseInt(e.target.value, 10))}
                        className="border p-1"
                    />
                    <button
                        onClick={handleAddNewTicket}
                        className="bg-orange-500 text-white px-4 py-2"
                        disabled={!isValidEmail(newTicket.email as string) || !isValidPhone(newTicket.phone as string)}
                    >
                        Add Ticket
                    </button>
                </div>
            )}

            {tickets.length === 0 && (
                <div>
                    <p>No ticket yet.</p>
                    <button
                        onClick={() => setIsAddingTicket(true)}
                        className="bg-orange-500 text-white px-4 py-2"
                    >
                        Add Ticket
                    </button>
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
                            <tr key={ticket.id} className="hover:bg-gray-100">
                                <td className="border px-4 py-2 text-center">{formatId(ticket.id as number)}</td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="text"
                                        value={ticket.name}
                                        onChange={(e) => onNameChange(ticket.id as number, e.target.value)}
                                        className="border p-1 w-full"
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="email"
                                        value={ticket.email}
                                        onChange={(e) => onEmailChange(ticket.id as number, e.target.value)}
                                        className={`border p-1 w-full ${!isValidEmail(ticket.email as string) ? 'border-red-500' : ''}`}
                                    />
                                </td>
                                <td className="border px-4 py-2">
                                    <input
                                        type="tel"
                                        value={ticket.phone}
                                        onChange={(e) => onPhoneChange(ticket.id as number, e.target.value)}
                                        className={`border p-1 w-full ${!isValidPhone(ticket.phone as string) ? 'border-red-500' : ''}`}
                                    />
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
                                    <input
                                        type="number"
                                        value={ticket.ready}
                                        onChange={(e) => onReadyChange(ticket.id as number, parseInt(e.target.value, 10))}
                                        className="border p-1 w-full text-center"
                                    />
                                </td>
                                <td className="border px-4 py-2 text-center">
                                    <button
                                        onClick={() => onDeleteTicket(ticket.id as number)}
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
