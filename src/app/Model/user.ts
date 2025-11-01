export class User {
    count: number;
    UserName: string;
    Password: string;
    UserType: string;
    status: number;
    message: string;
}

export class Alert {
    id: string;
    type: AlertType;
    message: string;
    autoClose: boolean;
    keepAfterRouteChange: boolean;
    fade: boolean;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }
}

export interface UserData {
    CustID: any,
    Cust_Name: string,
    BankName: any,
    Amount: number,
    TransactionID: any,
    date: any,
    count:any
}

export interface CUSTOMER {
    CustID: any,
    Cust_Name: string,
    BankName: any,
    Amount: number,
    TransactionID: any,
    date: any,
    PlanID:any
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}

export class LabelChange{
    PackingChrg: any
}