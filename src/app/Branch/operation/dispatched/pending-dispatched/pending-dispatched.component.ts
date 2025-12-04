import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AllServicesService } from 'app/service/all-services.service';
import { HttpService } from 'app/service/http.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-pending-dispatched',
  templateUrl: './pending-dispatched.component.html',
  styleUrls: ['./pending-dispatched.component.css']
})
export class PendingDispatchedComponent implements OnInit {

  sessionLocationCode: any;
  pageSize: number ;
  pageSizeOptions: number[] = [15,50,100,1000];
  totalountPages: any;
  totalPending: number;
  showTable = false;
  ManifestViewData: any[] = []; 
  showFirstLastButtons: any;
  currentPage = 1;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: any[] = [ 'awbNo', 'bookDate', 'customerName', 'consigneeName','productName', 'modeName','deliverTypeName','fromDest','toDest','qty','actualWt','manifestNo','manifestDate','ManifestMode','invoiceNo', 'invoiceValue'];  dataLoaded: boolean = false;
  userType: any;
  selectedValue: string = 'All';
  destinationName: string = 'All';

  constructor(private http: AllServicesService,
              private httpService: HttpService){
              }
  
  ngOnInit(): void {
    this.userType = localStorage.getItem('userType');
    this.dataSource = new MatTableDataSource<any>(this.ManifestViewData);
    this.sessionLocationCode = localStorage.getItem('userType') !== 'Admin'
     ? localStorage.getItem('originCode')
     : localStorage.getItem('selectedValue');
      this.pendingTableData(1, 15);
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  refresh() {
    this.pendingTableData(1,15);
  }

  pendingTableData(pageNumber: number, pageSize: number){
   if(this.userType === 'Admin'){
    this.httpService.get(`${environment.apiUrl}dispatch/pendingDispatch?sessionLocationCode=${this.sessionLocationCode}&pageNumber=${pageNumber}&pageSize=${pageSize}`).then((resp:any)=>{
      if (resp.status === 1){
        this.showTable =true;
        this.ManifestViewData = resp.Data;
         this.dataSource.data = this.ManifestViewData;
        this.dataSource.paginator = this.paginator;
        this.dataLoaded = true; 
      } else{
        this.showTable =false;
      }
    });
   }else{
    this.http.getpendingDispatch(this.sessionLocationCode ,pageNumber ,pageSize).subscribe((resp:any)=>{
      if (resp.status === 1){
        this.showTable =true;
        this.ManifestViewData = resp.Data;
         this.dataSource.data = this.ManifestViewData;
        // this.paginator.length = resp.TotalRecords;
        this.dataSource.paginator = this.paginator;
        this.dataLoaded = true;
      }
    });
   }
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  loadPage(event: any) {
    const pageNumber = event.pageIndex + 1;
    const pageSize = event.pageSize;
    this.pendingTableData(pageNumber, pageSize);
  }
}

