import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  CreditNote(operation: string, payload: {
    customerCode: string;
    particulars: string;
    amount: number;
    noteDate: string;
    remark: string;
    noteNo: string;
  }, pageNumber: string, pageSize: string): Observable<any> {
    const { customerCode, particulars, amount, noteDate, remark, noteNo } = payload;

    const url = `${environment.apiUrl}Payment/CreditNote?masterName=CreditNote&operation=${operation}&customerCode=${customerCode}&particulars=${particulars}&amount=${amount}&noteDate=${noteDate}&remark=${remark}&noteNo=${noteNo}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

    return this.http.get(url);
  }
  getCreditNotes(pageNumber: number, pageSize: number): Observable<any> {
  const url = `${environment.apiUrl}Payment/CreditNote?masterName=CreditNote&operation=getCreditNote&pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return this.http.get(url);
}

deleteCreditNote( noteNo: string): Observable<any> {
  const url = `${environment.apiUrl}Payment/CreditNote?masterName=CreditNote&operation=deleteCreditNote&noteNo=${noteNo}`;
  return this.http.get(url);
}
getByCreditNoteCode(noteNo: string ): Observable<any> {
  const url = `${environment.apiUrl}Payment/CreditNote?masterName=CreditNote&operation=getByCreditNoteCode&noteNo=${noteNo}`;
  return this.http.get(url);
}
getByBankName(): Observable<any> {
  const url = `${environment.apiUrl}Payment/ReceivedPay?masterName=ReceivedPay&operation=getBankName`;
  return this.http.get(url);
}
   receivedPayApi(operation: string, payload: any, pageNumber: string, pageSize: string): Observable<any> {
    const {
      customerCode,
      bankName,
      cheqDt,
      recvDt,
      amountType,
      chequeNo,
      recvName,
      tds,
      amount,
      debit,
      remark,
      depositBank,
      userName,
      refClub
    } = payload;

    const url = `${environment.apiUrl}Payment/ReceivedPay?masterName=ReceivedPay&operation=${operation}&customerCode=${customerCode}&bankName=${bankName}&cheqDt=${cheqDt}&recvDt=${recvDt}&amountType=${amountType}&chequeNo=${chequeNo}&recvName=${recvName}&tds=${tds}&amount=${amount}&debit=${debit}&remark=${remark}&depositBank=${depositBank}&userName=${userName}&refClub=${refClub}&pageNumber=${pageNumber}&pageSize=${pageSize}`;

    return this.http.get(url);
  }
    receivedPayNotes(pageNumber: number, pageSize: number): Observable<any> {
  const url = `${environment.apiUrl}Payment/ReceivedPay?masterName=ReceivedPay&operation=getReceivedPay&pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return this.http.get(url);
}


deleteReceivedPay(refClub: string): Observable<any> {
  const url = `${environment.apiUrl}Payment/ReceivedPay?masterName=ReceivedPay&operation=deleteReceivedPay&refClub=${refClub}`;
  return this.http.get(url);
}
getByReceivedPayCode(refClub: string ): Observable<any> {
  const url = `${environment.apiUrl}Payment/ReceivedPay?masterName=ReceivedPay&operation=getByReceivedPayCode&refClub=${refClub}`;
  return this.http.get(url);
}
   getAndDeleteWallet( pageNumber: number, pageSize: number): Observable<any> {
  const url = `${environment.apiUrl}Wallet/getAndDeleteWallet?inputName=GetWallet&pageNumber=${pageNumber}&pageSize=${pageSize}`;
  return this.http.get(url);
}
  createWallet(walletData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}Wallet/createWallet`, walletData);
  }
  DeleteWallet(id: number, customerCode: string): Observable<any> {
    const url = `${environment.apiUrl}Wallet/getAndDeleteWallet?inputName=DeleteWallet&id=${id}&customerCode=${customerCode}`;
    return this.http.get(url);
  }

  getCashToPay(awb: number, customerCode: string,clientType:string,fromDate:any,toDate:any,pageNumber: number, pageSize: number): Observable<any> {
    const url = `${environment.apiUrl}Payment/GetCashTopPay?awbno=${awb || ''}&customerCode=${customerCode}&clientType=${clientType}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

createCashToPay(obj:any): Observable<any> {
    const url = `${environment.apiUrl}Payment/CreateCashTopPay`;
    return this.http.post(url,obj);
  }

  deleteCashToPay(id:any): Observable<any> {
    const url = `${environment.apiUrl}Payment/deleteCashTopay?Id=${id}`;
    return this.http.get(url);
  }


  //Payment Report Api
 
  walletReport(customerCode:any,fromDate:any,toDate:any,pageNumber:any,pageSize:any): Observable<any> {
    const url = `${environment.apiUrl}Payment/WalletReport?customerCode=${customerCode}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

cashToPayReport(sessionLocationCode:any,AwbNo:any,customerCode:any,shipperName:any,consigneeName:any,clientType:any,fromDate:any,toDate:any,pageNumber:any,pageSize:any): Observable<any> {
    const url = `${environment.apiUrl}Payment/CashTopPayReport?customerCode=${customerCode || ''}&AwbNo=${AwbNo}&shipperName=${shipperName || ''}&consigneeName=${consigneeName || ''}&sessionLocationCode=${sessionLocationCode}&clientType=${clientType}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

  creditNotReport(sessionLocationCode:any,customerCode:any,shipperName:any,consigneeName:any,fromDate:any,toDate:any,pageNumber:any,pageSize:any): Observable<any> {
    const url = `${environment.apiUrl}Payment/CreditNoteReport?customerCode=${customerCode || ''}&shipperName=${shipperName || ''}&consigneeName=${consigneeName || ''}&sessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

  PaymentEntryReport(sessionLocationCode:any,customerCode:any,shipperName:any,consigneeName:any,fromDate:any,toDate:any,pageNumber:any,pageSize:any): Observable<any> {
    const url = `${environment.apiUrl}Payment/PaymentEntryReport?customerCode=${customerCode || ''}&shipperName=${shipperName || ''}&consigneeName=${consigneeName || ''}&sessionLocationCode=${sessionLocationCode}&fromDate=${fromDate}&toDate=${toDate}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get(url);
  }

PaymentCreditNotePrint(noteNo: any): Observable<Blob> {
  const url = `${environment.apiUrl}Payment/creditNotePrint?NoteNo=${noteNo}`;
  return this.http.get(url, {responseType: 'blob'});
}




}
