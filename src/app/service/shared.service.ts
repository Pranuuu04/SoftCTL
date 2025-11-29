import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public ManfDone: any;
  public ManfPending: any;
  public InscanDone: any;
  public InscanPending: any;
  public DrsDone: any;
  public DrsPending: any;
  public SalesCredit: any;
  public SalesCash: any;
  public SalesToPay: any;
  public SalesCOD: any;
  public InTransit: any;
  public UnDelivered: any;
  public Delivered: any;
  public RTO: any;
  public OFD: any;

  private branchType = 'All'; // Default value

  private fromDateSource = new BehaviorSubject<string>('');
  private toDateSource = new BehaviorSubject<string>('');

  fromDate$ = this.fromDateSource.asObservable();
  toDate$ = this.toDateSource.asObservable();

  private selectedValueSubject = new BehaviorSubject<string>(
    localStorage.getItem('selectedValue') || 'All'
  );
  public selectedValue$: Observable<string> = this.selectedValueSubject.asObservable();

  private dataSubject = new BehaviorSubject<any>({});
  data$ = this.dataSubject.asObservable();

  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  constructor() {
    // const selectedValue = localStorage.getItem('selectedValue');
    // console.log('SelectedValue from localStorage:', selectedValue);
    // this.selectedValueSubject = new BehaviorSubject<string>(selectedValue || 'All');
  }
 updateSelectedValuee(newValue: string) {
    localStorage.setItem('selectedValue', newValue);
  }
  
 getSelectedValue(): string {
     const data = localStorage.getItem('selectedValue') || 'All';
     return data;
 }
 updateBranchType(newValue: string) {
  this.branchType = newValue;
}

getBranchType(): string {
  return this.branchType;
}
  updateData(data: any) {
    this.dataSubject.next(data);
  }
  // setBranch(Data: string) {
  //   this.selectedValueSubject.next(Data);
  // }

  setFromDate(date: string) {
    this.fromDateSource.next(date);
  }

  setToDate(date: string) {
    this.toDateSource.next(date);
  }

  triggerRefresh() {
    this.refreshSubject.next();
  }

  updateSelectedValue(value: string) {
    this.selectedValueSubject.next(value);
  }

}
