import { useToast } from "@/hooks/use-toast";
import { TCustomer } from "@/types";
import {
  getSmeDocRef,
  getSmeDocument,
  updateQueueForSME,
} from "@/utils/firebase";
import { onSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// type Ticket = {
//     id: number;
//     name: string;
//     status: string;
//     ready: number; // Store ready time in minutes
// };

const Userface: React.FC = () => {
  const [tickets, setTickets] = useState<TCustomer[]>(() => {
    const storedTickets = localStorage.getItem("tickets");
    return storedTickets ? JSON.parse(storedTickets) : [];
  });

  const { toast } = useToast();

  const { smeEmail } = useParams();

  // User has to scan the qr code to get on the queue. SO this page will be rendered dynamically based on the company's email.
  // We can pass in the email through the data to get the people on the queue and when the person clicks submit, we can pass in a customer through.
  //

  // Update tickets state when localStorage changes
  // We cam jave a useEffect that gets the name and email and checks if they exist in the ticket, if they dont, remove them from the local storage

  //Remove all local storage items if the user is not on the queue

  useEffect(() => {
    console.log(smeEmail);
    // We get the queue for the current sme, right.
    // But not until we loop through the queue to check if the usersName and emmail that we got from the localStorage is in the queue.
    // If it is, we set the pageState to queue. We notify that they are already on the queue and navigate to the queue page
    // If it is not, we set the pageState to input-your-details.

    const fetchQueue = async () => {
      try {
        const response = await getSmeDocument(smeEmail as string);

        if (response) {
          const customers = response.queue || [];
          localStorage.setItem("tickets", JSON.stringify(customers));
          setTickets(customers);

          const customerExist = customers.find((customer) => {
            const storedName = localStorage.getItem("customerName");
            const storedEmail = localStorage.getItem("customerEmail");
            return (
              customer.customerName === storedName &&
              customer.customerEmail === storedEmail
            );
          });

          if (customerExist) {
            setPageState("queue");
            toast({
              description: "You are already on the queue",
            });
          } else {
            localStorage.removeItem("customerName");
            localStorage.removeItem("customerEmail");
            localStorage.removeItem("customerPhone");
            localStorage.removeItem("tickets");

            toast({
              description:
                "Kindly fill in your details to check your position on the queue",
            });
            setPageState("input-your-details");
          }
        }
        console.log(response);
      } catch (error) {
        toast({
          description: "Error fetching queue",
        });
        console.log("Error fetching queue", error);
      }
    };
    fetchQueue();
  }, [smeEmail, toast]);

  // useEffect(() => {
  //     const handleStorageChange = () => {
  //         const storedTickets = localStorage.getItem('tickets');
  //         if (storedTickets) {
  //             setTickets(JSON.parse(storedTickets));
  //         }
  //     };

  //     window.addEventListener('storage', handleStorageChange);

  //     // Cleanup event listener on component unmount
  //     return () => {
  //         window.removeEventListener('storage', handleStorageChange);
  //     };
  // }, []);
  useEffect(() => {
    const handleStorageChange = () => {
      const storedTickets = localStorage.getItem("tickets");
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    console.log("tickets", tickets);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [tickets]);

  // Function to format ready time as Minutes or Hours
  // const formatReadyTime = (minutes: number): string => {
  //     if (minutes >= 60) {
  //         const hours = Math.floor(minutes / 60);
  //         return `${hours} Hour${hours > 1 ? 's' : ''}`;
  //     }
  //     return `${minutes} Minute${minutes !== 1 ? 's' : ''}`;
  // };

  // Function to format ticket ID as a three-digit number with leading zeros
  const formatTicketId = (id: number): string => {
    return id.toString().padStart(3, "0");
  };

  const [pageState, setPageState] = useState<"queue" | "input-your-details">(
    "queue"
  );
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  useEffect(() => {
    // get the sme document from the firebase
    // Then we set the currentSme state to the sme document
    const unsubscribe = onSnapshot(getSmeDocRef(smeEmail as string), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const queue = data?.queue || [];
        setTickets([
          ...queue.map((customer: TCustomer) => ({
            ...customer,
            // ready: customer.ready.toDate().getTime(),
          })),
        ]);
      }

      return () => unsubscribe();
    });
  }, [smeEmail]);

  useEffect(() => {
    // Check for URL in localStorage
    const currentUrl = window.location.href;
    const urlExists = localStorage.getItem(currentUrl);

    if (!urlExists) {
      setPageState("input-your-details");
    }
  }, []);

  // function isTCustomerArray(response: TCustomer[]): response is TCustomer[] {
  //     // Check if the response is an array
  //     if (!Array.isArray(response)) {
  //       return false;
  //     }

  //     // Check if every element in the array matches the TCustomer type
  //     return true;
  //   }
  const handleSubmit = async () => {
    if (name && email && phoneNumber) {
      const currentUrl = window.location.href;
      // Save user info and URL to localStorage
      localStorage.removeItem("tickets");
      localStorage.setItem(currentUrl, "true");
      localStorage.setItem("customerName", name);
      localStorage.setItem("customerEmail", email);
      localStorage.setItem("customerPhone", phoneNumber);

      try {
        const response = await updateQueueForSME(smeEmail as string, [
          ...tickets,
          {
            ticketNo: tickets.length + 1,
            customerName: name,
            customerEmail: email,
            customerPhone: phoneNumber,
            notified: false,
          },
        ]);
        if (response) {
          setTickets(response as TCustomer[]);
          toast({
            description: "Added to queue",
          });
        } else {
          toast({
            description: "You are already on the queue",
          });
        }
      } catch (error) {
        toast({
          description: "Error adding to queue",
        });
        console.log("Error adding to queue", error);
      }
      setPageState("queue");
    } else {
      toast({
        description:
          "Please fill in your details. Ensure to fill in all fields",
      });
    }
  };

//   useEffect(() => {
//     const requestPermission = async () => {
//       try {
//         const permission = await Notification.requestPermission();
//         if (permission === "granted") {
//           console.log("Notification permission granted.");

//           // Get the registration token for the device
//           const token = await getToken(messaging, {
//             vapidKey:
//               "BNRQuoKGV3t8p-ahe3u0L2TC5tVbuNPJYg4MpZAabYCOyvYjACKFg-uEtJW1EXUB9q5M27JQSHo-K70QjmPpDM8",
//           });
//           if (token) {
//             console.log("FCM Token:", token);
//             // Send the token to your server for later use
//             const customerName = localStorage.getItem("customerName");
//             const customerEmail = localStorage.getItem("customerEmail");
//             const customerPhone = localStorage.getItem("customerPhone");
//             if (customerName && customerEmail && customerPhone) {
//               tickets.map(async (ticket) => {
//                 if (
//                   ticket.customerName === customerName &&
//                   ticket.customerEmail === customerEmail &&
//                   ticket.customerPhone === customerPhone
//                 ) {
//                   await updateQueueForSME(smeEmail as string, [
//                     ...tickets,
//                     {
//                       ...ticket,
//                       fcMToken: token,
//                     },
//                   ]);
//                 }
//               });
//             }
//           }
//         } else {
//           toast({
//             description: "Notification permission denied",
//           });
//           console.log("Notification permission denied.");
//         }
//       } catch (error) {
//         console.error("Error getting FCM token", error);
//       }
//     };

//     requestPermission();
//   }, [toast]);

  return (
    <div className="flex min-h-screen">
      {pageState === "input-your-details" && (
        <>
          <div className="flex flex-col justify-center items-center w-1/8">
            <h2 className="font-bold text-2xl uppercase rotate-90 transform tracking-widest">
              Kindly Fill Up
            </h2>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div>
              <form className="grid gap-6 italic font-semibold">
                <div>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber">Phone:</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="border-dotted border-4 border-white bg-black text-white"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </>
      )}
      {pageState === "queue" && (
        <div className="p-4 bg-orange-100 h-screen w-full">
          <h1 className="text-3xl font-bold text-center">Who's Up Next?</h1>
          {tickets.length === 0 ? (
            <p className="text-center text-gray-500 pt-60 text-2xl">
              Nobody on the QUEUE yet
            </p>
          ) : (
            <table className="translate-y-6 w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-center">#</th>
                  <th className="border px-4 py-2 text-center">Name</th>
                  <th className="border px-4 py-2 text-center">Email</th>
                  <th className="border px-4 py-2 text-center">Phone Number</th>
                  {/* <th className="border px-4 py-2 text-center">Status</th> */}
                  {/* <th className="border px-4 py-2 text-center">Ready In</th> */}
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => {

const isCurrentCustomer = ticket.customerName === localStorage.getItem('customerName') &&
ticket.customerEmail === localStorage.getItem('customerEmail') &&
ticket.customerPhone === localStorage.getItem('customerPhone');
                  return (
                    <tr
                      key={ticket.ticketNo}
                      className={`hover:bg-gray-100 ${
                        isCurrentCustomer && "bg-green-400"
                      }`}
                    >
                      <td className="border px-4 py-2 text-center">
                        {formatTicketId(ticket.ticketNo)}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {ticket.customerName}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {ticket.customerEmail}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        {ticket.customerPhone}
                      </td>
                      {/* <td className="border px-4 py-2 text-center">{ticket.status}</td> */}
                      {/* <td className="border px-4 py-2 text-center">
                                            <span className="ml-2">{formatReadyTime(ticket.ready)}</span>
                                        </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Userface;
