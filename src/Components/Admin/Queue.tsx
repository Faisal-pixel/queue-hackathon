import { useContext, useEffect, useState } from "react";
import { TCustomer, Tsme } from "../../types";
import { GlobalContext } from "../../context/global-context";
import { checkIfSmeExists, deleteCustomerFromQueue, getSmeDocument } from "../../utils/firebase";
import { User } from "firebase/auth";
import { QRCodeSVG } from "qrcode.react";


const TicketTable = () => {
  //   const [newCustomer, setNewCustomer] = useState<Omit<TCustomer, "ticketNo">>({
  //     customerName: "",
  //     customerEmail: "",
  //     customerPhone: "",
  //     status: "in process",
  //     ready: 0,
  //     notified: false,
  //   });

  const { currentSME, currentUser, currentEmployee, setCurrentSME } =
    useContext(GlobalContext);
  const [tickets, setTickets] = useState<TCustomer[]>([]);
  const [qrUrl, setQrUrl] = useState<string>("");

  // Load SME data
  useEffect(() => {
    if (!currentUser) return;
    const fetchDocument = async () => {
      let newSME: Tsme | null = null;

      try {
        //If current user is a currentEmployee, then use the smeMail to get the smeDocument
        if (currentEmployee) {
          const smeDoc = await getSmeDocument(currentEmployee.smeMail as string);
          if (smeDoc && typeof smeDoc !== "boolean") {
            newSME = {
              ...currentSME,
              queue: smeDoc.queue || [],
              smeName: smeDoc.smeName,
              queueLength: smeDoc.queue.length,
              employees: smeDoc.employees,
              isFirstTime: false,
            };
          }
        } else {
          // else just use the current user to get the smeDocument
          const smeDoc = await getSmeDocument(currentUser.email!);
          if (smeDoc && typeof smeDoc !== "boolean") {
            newSME = {
              ...currentSME,
              queue: smeDoc.queue || [],
              smeName: smeDoc.smeName,
              queueLength: smeDoc.queue.length,
              employees: smeDoc.employees,
              isFirstTime: false,
            };
          }
        }

        if (newSME) {
          setCurrentSME(newSME);
        }
      } catch (error) {
        console.log("Error loading SME data", error);
      }
    };

    fetchDocument();
  }, [currentUser, currentEmployee, currentSME, setCurrentSME]);

  // Load tickets from SME context
  useEffect(() => {
    if(!currentSME)  return;
    if (currentSME) {
      setTickets(currentSME.queue || []);
    }
  }, [currentSME]);
  //   const [isAddingTicket, setIsAddingTicket] = useState(false);

  const handleDeleteTicket = async (ticketNoToDel: number) => {
    try {
      const response = await checkIfSmeExists(currentUser as User);
      if(!response) {
        await deleteCustomerFromQueue(currentEmployee?.email as string, ticketNoToDel);
      } else {
        await deleteCustomerFromQueue(currentUser?.email as string, ticketNoToDel);
      }
    } catch (error) {
      console.log("Error deleting ticket", error);
    }
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

  const handleGenerateQr = () => {
    const adminORSmeEmail = currentEmployee?.smeMail || (currentSME ? currentUser?.email : null);
    console.log(adminORSmeEmail);
    const location = window.location.href;
    const parsedUrl = new URL(location);
    // const qr_svg = location?.includes(`localhost/${adminORSmeEmail}`) ? qr.image(`${location}`, { type: "svg" }) : qr.image(`https://queue-bice.vercel.app/${adminORSmeEmail}`, { type: "svg" });
    if(location?.includes(`localhost`)) {
      setQrUrl(`${parsedUrl.protocol}${parsedUrl.host}/${adminORSmeEmail}`);
    } else {
      setQrUrl(`https://queue-bice.vercel.app/${adminORSmeEmail}`);
    }
    // qr_svg.pipe(fs.createWriteStream("qr-code.svg"));

    console.log(qrUrl);
  };

  const formatId = (id: number) => id.toString().padStart(3, "0");

  return (
    <div className="flex flex-col p-4 gap-y-5">
      <h1 className="text-3xl font-bold mb-4 pt-5">Queue Management</h1>
      <div>
        <p className="mb-3">Click the button below to generate a qr code for your cusotmers.  </p>
        <button onClick={handleGenerateQr} type="button" className="px-4 py-2 bg-transparent border-2 border-orange-400 w-full">Generate QR code</button>

        <div>
          {qrUrl && <QRCodeSVG value={qrUrl} />}
        </div>
      </div>

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
                    <p>{ticket.ready && ticket.ready.toDate().toLocaleString()}</p>
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
