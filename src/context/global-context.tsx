import { User } from 'firebase/auth';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { TCustomer, TEmployee, TpageState, Tsme } from '../types';
import { checkIfAdminExists, checkIfSmeExists, getSmeDocRef, getSmeDocument, onAuthStateChangedListener } from '../utils/firebase';
import { onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

type TGlobalContext = {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    currentSME: Tsme | null;
    setCurrentSME: (sme: Tsme | null) => void;
    currentEmployee: TEmployee | null;
    setCurrentEmployee: (employee: TEmployee | null) => void;
    pageState: TpageState;
    setPageState: (state: TpageState) => void;
}

export const GlobalContext = createContext<TGlobalContext>({
    currentUser: null,
    setCurrentUser: () => {},
    currentSME: null,
    setCurrentSME: () => {},
    currentEmployee: null,
    setCurrentEmployee: () => {},
    pageState: "login",
    setPageState: () => {},
});

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentSME, setCurrentSME] = useState<Tsme | null>(null);
    const [currentEmployee, setCurrentEmployee] = useState<TEmployee | null>(null);
    const [pageState, setPageState] = useState<TpageState>("login");

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(async (user) => {
            if (user) {
                // Check if the user exists as an SME
                console.log(user);
                const smeExists = await checkIfSmeExists(user);
    
                if (smeExists) {
                    const smeData = await getSmeDocument(user.email as string);
                    // Set current SME in context (assuming you have a context for SME state)
                    setCurrentSME(smeData as Tsme);
                    // Navigate to SME dashboard
                    navigate("/admin-queue");
                } else {
                    // Check if the user exists as an employee
                    const smeEmail = await checkIfAdminExists(user);
                    
                    if (smeEmail) {
                        const smeData = await getSmeDocument(smeEmail);
                        // Set current SME in context
                        setCurrentSME(smeData as Tsme);
                        // Navigate to employee dashboard
                        navigate("/admin-queue");
                    } else {
                        // Neither SME nor employee exists - Prompt user to insert company name
                        setPageState("insertCompanyName");
                    }
                }
            } else {
                // If user is not logged in, set current user to null
                setCurrentUser(null);
            }
        });
    
        return unsubscribe;
    }, [navigate]);
    
    
    

    useEffect(() => {
        // Getting the sme 
        if(!currentUser) return;
        const getSmeDoc = async () => {
            const sme = await getSmeDocument(currentUser.email!);
            if(sme) {
                setCurrentSME(sme);
            } 
        }

        getSmeDoc();

        console.log(currentSME);
    }, [currentUser, currentSME]);

    useEffect(() => {
        if(!currentSME) return;
        // get the sme document from the firebase
        // Then we set the currentSme state to the sme document
        const unsubscribe = onSnapshot(getSmeDocRef(currentSME.smeName), (doc) => {
            if(doc.exists()) {
                const data = doc.data();
                setCurrentSME({
                    
                    ...data as Tsme,
                    queue: data.queue.map((customer: TCustomer) => ({
                        ...customer,
                        ready: customer.ready.toDate().getTime(),
                    })),
                    employees: data.employees.map((employee: TEmployee) => ({
                        ...employee,
                        dateAdded: employee.dateAdded ? employee.dateAdded.toDate().getTime() : null,
                    })),

                });
            }

            return () => unsubscribe();
        });
    }, [currentSME])

    return (
        <GlobalContext.Provider value={{ currentUser, setCurrentUser, currentSME, setCurrentSME, currentEmployee, setCurrentEmployee, pageState, setPageState }}>
            {children}
        </GlobalContext.Provider>
    )
}