import { User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { TCustomer, TEmployee, TpageState, Tsme } from "../types";
import {
  checkIfSmeExists,
  getEmployeeCollection,
  getSmeDocRef,
  onAuthStateChangedListener,
} from "../utils/firebase";
import { onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

type TGlobalContext = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  currentSME: Tsme | null;
  setCurrentSME: (sme: Tsme | null) => void;
  currentEmployee: TEmployee | null;
  setCurrentEmployee: (employee: TEmployee | null) => void;
  pageState: TpageState;
  setPageState: (state: TpageState) => void;
  signInAsSME: boolean;
  setSignInAsSME: (state: boolean) => void;
  allowAccess: boolean;
  setAllowAccess: (state: boolean) => void;
};

export const GlobalContext = createContext<TGlobalContext>({
  currentUser: null,
  setCurrentUser: () => {},
  currentSME: null,
  setCurrentSME: () => {},
  currentEmployee: null,
  setCurrentEmployee: () => {},
  pageState: "login",
  setPageState: () => {},
  signInAsSME: false,
  setSignInAsSME: () => {},
  allowAccess: false,
  setAllowAccess: () => {},
});

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSME, setCurrentSME] = useState<Tsme | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<TEmployee | null>(
    null
  );
  const [pageState, setPageState] = useState<TpageState>("login");
  const [signInAsSME, setSignInAsSME] = useState<boolean>(false);
  const [allowAccess, setAllowAccess] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      if (!user) {
        setAllowAccess(false);
        setCurrentUser(null);
      }
      setCurrentUser(user);
      if (user) {
        // Check if the user exists as an SME
        console.log(user);

        if(!signInAsSME) {
          const response = await checkIfSmeExists(user);
          if (!response) {
            console.log("User is not signing in as an SME");
            navigate("/not-an-employee");
            setAllowAccess(true);
            return;
          }

          const employeeDoc = await getEmployeeCollection(user);

          if(employeeDoc) {
            const newEmployee: TEmployee = {
              ...currentEmployee,
              firstName: employeeDoc.firstName,
              lastName: employeeDoc.lastName,
              email: employeeDoc.email,
              role: "admin",
              smeMail: employeeDoc.smeMail
            }

            setCurrentEmployee(newEmployee)
          }
          setAllowAccess(true);
          navigate("/admin-queue");
        }

        const response = await checkIfSmeExists(user);
        if (response) {
          console.log("User exists as an SME");
          setAllowAccess(true);
          navigate("admin-queue");
          return;
        } else {
          console.log("User does not exist as an SME");
          setPageState("insertCompanyName");
          setCurrentUser(user);
          setAllowAccess(true);
          return;
        }
      }
    });

    return unsubscribe;
  }, [navigate, signInAsSME, currentEmployee]);

  // useEffect(() => {
  //     // Getting the sme
  //     if(!currentUser) return;
  //     const getSmeDoc = async () => {
  //         const sme = await getSmeDocument(currentUser.email!);
  //         if(sme) {
  //             setCurrentSME(sme);
  //         }
  //     }

  //     getSmeDoc();

  //     console.log(currentSME);
  // }, [currentUser, currentSME]);

  useEffect(() => {
    if (!currentSME) return;
    // get the sme document from the firebase
    // Then we set the currentSme state to the sme document
    const unsubscribe = onSnapshot(getSmeDocRef(currentSME.smeName), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setCurrentSME({
          ...(data as Tsme),
          queue: data.queue.map((customer: TCustomer) => ({
            ...customer,
            ready: customer.ready.toDate().getTime(),
          })),
          employees: data.employees.map((employee: TEmployee) => ({
            ...employee,
            dateAdded: employee.dateAdded
              ? employee.dateAdded.toDate().getTime()
              : null,
          })),
        });
      }

      return () => unsubscribe();
    });
  }, [currentSME]);

  return (
    <GlobalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentSME,
        setCurrentSME,
        currentEmployee,
        setCurrentEmployee,
        pageState,
        setPageState,
        signInAsSME,
        setSignInAsSME,
        allowAccess,
        setAllowAccess,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
