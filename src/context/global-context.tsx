import { User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { TCustomer, TEmployee, TpageState, Tsme } from "../types";
import {
  checkIfAdminExists,
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
  signInAsEmployee: boolean;
  setSignInAsEmployee: (state: boolean) => void;
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
  signInAsEmployee: false,
  setSignInAsEmployee: () => {},
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
  const [signInAsEmployee, setSignInAsEmployee] = useState<boolean>(false);
  const [allowAccess, setAllowAccess] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      
      if (!user) {
        setAllowAccess(false);
        setCurrentUser(null);
        return;
      }
      setCurrentUser(user);
      if (user) {
        // Check if the user exists as an SME
        console.log("from the use effect in global context", user);
        // ALL THIS IS FOR WHEN A USER CLICKS ON LOG IN AS AN  EMPLOYEE
        if(signInAsEmployee) {
          console.log("Didnt click on sign in as sme, clicked on sign in as employee")
          const response = await checkIfAdminExists(user);
          if (!response) {
            console.log("User doesnt exist as an employee");
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
          return;
        }

        // THE ABOVE IS FOR WHEN A USER CLICKS ON LOG IN AS AN  EMPLOYEE

        // THE BELOW IS FOR WHEN A USER CLICKS ON LOG IN AS AN SME
        const response = await checkIfSmeExists(user);
        if (response) {
          console.log("User exists as an SME");
          setAllowAccess(true);
          navigate("admin-queue");
          return;
        } else {
          console.log("User does not exist as an SME");
          setPageState("insertCompanyName");
          setAllowAccess(true);
          return;
        }
      }
    });

    return unsubscribe;
  }, [ signInAsEmployee, currentEmployee]);

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
        signInAsEmployee,
        setSignInAsEmployee,
        allowAccess,
        setAllowAccess,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
