import { User } from 'firebase/auth';
import { createContext, ReactNode, useState } from 'react';
import { TEmployee, Tsme } from '../types';

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

    return (
        <GlobalContext.Provider value={{ currentUser, setCurrentUser, currentSME, setCurrentSME, currentEmployee, setCurrentEmployee }}>
            {children}
        </GlobalContext.Provider>
    )
}