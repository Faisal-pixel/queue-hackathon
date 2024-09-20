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
  allowAccess: boolean;
  setAllowAccess: (state: boolean) => void;
  loading: boolean;
  setLoading: (state: boolean) => void;
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
  allowAccess: false,
  setAllowAccess: () => {},
  loading: false,
  setLoading: () => {},
});

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSME, setCurrentSME] = useState<Tsme | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<TEmployee | null>(
    null
  );
  const [pageState, setPageState] = useState<TpageState>("login");
  // const [signInAsEmployee, setSignInAsEmployee] = useState<boolean>(false);
  const [allowAccess, setAllowAccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

// useEffect(() => {
//   signOutUser();
// },  []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (storedUser) {
      setCurrentUser(storedUser);
    }

    
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      setLoading(false);
      if (!user) {
        setAllowAccess(false);
        setCurrentUser(null);
        return;
      }
      if (currentUser && currentUser.uid === user?.uid) {return};
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      if (user) {
        // Check if the user exists as an SME
        // ALL THIS IS FOR WHEN A USER CLICKS ON LOG IN AS AN  EMPLOYEE
        const signInAsEmployee = localStorage.getItem("signInAsEmployee") === "true";
        if (signInAsEmployee) {
          console.log(
            "Didnt click on sign in as sme, clicked on sign in as employee"
          );
          const response = await checkIfAdminExists(user);
          if (!response) {
            navigate("/not-an-employee");
            setAllowAccess(true);
            // localStorage.removeItem("signInAsEmployee")
            return;
          }

          const employeeDoc = await getEmployeeCollection(user);

          if (employeeDoc) {
            const newEmployee: TEmployee = {
              ...currentEmployee,
              firstName: employeeDoc.firstName,
              lastName: employeeDoc.lastName,
              email: employeeDoc.email,
              role: "admin",
              smeMail: employeeDoc.smeMail,
            };

            setCurrentEmployee(newEmployee);
            setAllowAccess(true);
            navigate("/admin-queue");
            // localStorage.removeItem("signInAsEmployee");
            return;
          }
        } else {
          // THE ABOVE IS FOR WHEN A USER CLICKS ON LOG IN AS AN  EMPLOYEE

          // THE BELOW IS FOR WHEN A USER CLICKS ON LOG IN AS AN SME
          const isSignInAsSME = localStorage.getItem("signInAsAnSME") === "true";
          if(!isSignInAsSME) {
            return
          }
          const response = await checkIfSmeExists(user);
          if (response) {
            setAllowAccess(true);
            navigate("admin-queue");
            // localStorage.removeItem("signInAsAnSME")
            return;
          } else {
            setPageState("insertCompanyName");
            setAllowAccess(true);
            // localStorage.removeItem("signInAsAnSME")
            return;
          }
        }
      }
    });

    return unsubscribe;
  }, []);

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
            // ready: customer.ready.toDate().getTime(),
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
        allowAccess,
        setAllowAccess,
        loading,
        setLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
