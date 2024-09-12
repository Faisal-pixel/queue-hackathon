import React, { useState, useEffect } from 'react';

type Ticket = {
    id: number;
    name: string;
    status: string;
    ready: number; // Store ready time in minutes
};

const Userface: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>(() => {
        const storedTickets = localStorage.getItem('tickets');
        return storedTickets ? JSON.parse(storedTickets) : [];
    });

    // Update tickets state when localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            const storedTickets = localStorage.getItem('tickets');
            if (storedTickets) {
                setTickets(JSON.parse(storedTickets));
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Function to format ready time as Minutes or Hours
    const formatReadyTime = (minutes: number): string => {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            return `${hours} Hour${hours > 1 ? 's' : ''}`;
        }
        return `${minutes} Minute${minutes !== 1 ? 's' : ''}`;
    };

    // Function to format ticket ID as a three-digit number with leading zeros
    const formatTicketId = (id: number): string => {
        return id.toString().padStart(3, '0');
    };

    return (
        <div className="p-4 bg-orange-100 h-screen">
            <h1 className="text-3xl font-bold text-center">Who's Up Next?</h1>
            {tickets.length === 0 ? (
                <p className="text-center text-gray-500 pt-60 text-2xl">Nobody on the QUEUE yet</p>
            ) : (
                <table className=" translate-y-6 w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 text-center">#</th>
                            <th className="border px-4 py-2 text-center">Name</th>
                            <th className="border px-4 py-2 text-center">Status</th>
                            <th className="border px-4 py-2 text-center">Ready In</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-gray-100">
                                <td className="border px-4 py-2 text-center">{formatTicketId(ticket.id)}</td>
                                <td className="border px-4 py-2 text-center">{ticket.name}</td>
                                <td className="border px-4 py-2 text-center">{ticket.status}</td>
                                <td className="border px-4 py-2 text-center">
                                    <span className="ml-2">{formatReadyTime(ticket.ready)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Userface;
