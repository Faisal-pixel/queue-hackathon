import { User } from 'firebase/auth';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { TCustomer, TEmployee, Tsme } from '../types';
import { getSmeDocRef } from '../utils/firebase';
import { onSnapshot } from 'firebase/firestore';

type TGlobalContext = {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    currentSME: Tsme | null;
    setCurrentSME: (sme: Tsme | null) => void;
    currentEmployee: TEmployee | null;
    setCurrentEmployee: (employee: TEmployee | null) => void;
}

export const GlobalContext = createContext<TGlobalContext>({
    currentUser: null,
    setCurrentUser: () => {},
    currentSME: null,
    setCurrentSME: () => {},
    currentEmployee: null,
    setCurrentEmployee: () => {},
});

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentSME, setCurrentSME] = useState<Tsme | null>(null);
    const [currentEmployee, setCurrentEmployee] = useState<TEmployee | null>(null);

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
                        dateAdded: employee.dateAdded.toDate().getTime(),
                    })),

                });
            }

            return () => unsubscribe();
        });
    }, [currentSME])

    return (
        <GlobalContext.Provider value={{ currentUser, setCurrentUser, currentSME, setCurrentSME, currentEmployee, setCurrentEmployee }}>
            {children}
        </GlobalContext.Provider>
    )
}