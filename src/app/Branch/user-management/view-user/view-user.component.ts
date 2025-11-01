import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'app/Comman/confirmation-dialog/confirmation-dialog.component';
import { AdminService } from 'app/service/admin.service';
import { AuthUserComponent } from '../auth-user/auth-user.component';

  @Component({
    selector: 'app-view-user',
    templateUrl: './view-user.component.html',
    styleUrls: ['./view-user.component.css']
  })
  export class ViewUserComponent implements OnInit{

    listData: any[] = [];
    dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['Username', 'UserType','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    UserType: string;
    UserName :string;
    sessionLocationCode: any;
    
    constructor(private adminService : AdminService,
                public dialog: MatDialog,
                private snackBar: MatSnackBar,  
                ) {
                  this.UserType = localStorage.getItem('userType');
                  this.UserName = localStorage.getItem('userName')
                  this.sessionLocationCode = localStorage.getItem('originCode');
                }
  
    ngOnInit(): void {
      this.Userlist();
    }
  
    openSnackBar(message: string, panelClass: string) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [panelClass]
      });
    }
  
    Userlist() {
      this.adminService.getUserList(this.UserType, this.sessionLocationCode).subscribe((resp: any) => {
        this.listData = resp.Data;
        this.dataSource = new MatTableDataSource(this.listData);
        this.dataSource.paginator = this.paginator;
      });
    }
    
    openUserEditModal(UserName : any) {
      const dialogRef = this.dialog.open(AuthUserComponent, {
        data: {
          action: 'add',
          userName: UserName,
        },
        width: '25rem',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
        }
      });
  }
  
    deleteList(userName : string) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '25rem',
        data: { message: `Are you sure you want to delete this ${userName}?` }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.adminService.deleteUser(userName).subscribe(
            (response: any) => { 
              if (response.status === 1) {
                this.openSnackBar( response.message , 'custom-snackbar')
                this.Userlist();
              }else{
                this.openSnackBar(response.message, 'error-snackbar')
              }              
            },(error) => {
              this.openSnackBar('Error occurred while deleting user', 'error-snackbar')
              console.error('Error occurred while deleting complaint', error);
            }
          );
        } else {
          this.openSnackBar(`Delete ${userName} canceled`, 'error-snackbar');
        }
      });
    }
    
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

  }