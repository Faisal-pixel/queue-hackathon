import { Timestamp } from "firebase/firestore";

export type Tsme = {
    smeName: string;
    isFirstTime: boolean;
    queue: TCustomer[];
    queueLength: number;
    employees: TEmployee[];
}

export type TCustomer = {
    ticketNo: number;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    status: string;
    ready: Timestamp;
    notified: boolean;
}

export type TEmployee = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    dateAdded?: Timestamp;
    smeMail?: string;
}

export type TpageState = "insertCompanyName" | "dashboard" | "login" | null;
