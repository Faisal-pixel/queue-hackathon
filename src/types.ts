export type Tsme = {
    smeName: string;
    isFirstTime: boolean;
    queue: TCustomer[];
    queueLength: number;
    employees: TEmployee[];
}

export type TCustomer = {
    ticketNo: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    status: string;
    timeFrame: string;
    notified: boolean;
}

export type TEmployee = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    dateAdded: string;
    smeMail: string;
}