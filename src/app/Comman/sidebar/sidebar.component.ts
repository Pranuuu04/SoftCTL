import { Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminManagementComponent } from 'app/Admin/User-management/admin-management/admin-management.component';
import { DocketPrintComponent } from 'app/Branch/Shared/report_pages/docket-print/docket-print.component';
import { UserComponent } from 'app/Branch/user-management/user/user.component';
import { HttpService } from 'app/service/http.service';

export declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'User Profile',  icon: 'person', class: '' },
    { path: '/table-list', title: 'Table List',  icon: 'content_paste', class: '' },
    { path: '/typography', title: 'Typography',  icon: 'library_books', class: '' },
    { path: '/icons', title: 'Icons',  icon: 'bubble_chart', class: '' },
    { path: '/maps', title: 'Maps',  icon: 'location_on', class: '' },
    { path: '/notifications', title: 'Notifications',  icon: 'notifications', class: '' },
    { path: '/upgrade', title: 'Upgrade to PRO',  icon: 'unarchive', class: 'active-pro' },
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Output() closeMenu = new EventEmitter<void>();
  menuItems: RouteInfo[] = [];
  userType: any;
  ClientLogo: any;
  customerMenuItems: any;
  booking: any;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChildren(MatMenuTrigger) allTriggers: QueryList<MatMenuTrigger>;
  captionName: any;
  groupName: string;
  captionType: string;
  subMenu: any;
  searchValue: string = '';
  searchType: string = 'Awb No.';
  searchDisable: boolean = true;
  userName: string;
  sessionLocationCode: string;
  responseData: any[] = [];
  sideMenu: any;
  dynamicMenus: any[] = [];
  storedValue: string;

  openedTriggers: MatMenuTrigger[] = [];



FrenchiseeMenuItems = [
  { path: '/dashboard', title: 'Frenchisee Dashboard',  icon: 'dashboard', class: '' },
  { path: '/user-profile', title: 'Shipping Status',  icon: 'person', class: '' },
  { path: '/table-list', title: 'Booking',  icon: 'content_paste', class: '' },
  { path: '/upgrade', title: 'Docket Printing',  icon: 'unarchive', class: '' },
  { path: '/table-list', title: 'Invoice',  icon: 'content_paste', class: '' },
  { path: '/table-list', title: 'MIS',  icon: 'content_paste', class: '' },
  { path: '/user-profile', title: 'Logout',  icon: 'person', class: '' },
]
  adminMaster: string;

constructor(
            public httpService: HttpService,
            private router: Router,
            private snackBar: MatSnackBar,
            public dialog: MatDialog,
            ) {
              this.sessionLocationCode = localStorage.getItem('originCode');
              this.dynamicMenus = JSON.parse(localStorage.getItem('responseData'))
  }

  ngOnInit() {
    this.userType = localStorage.getItem('userType');
    this.captionName = localStorage.getItem('captionName');
    this.groupName = localStorage.getItem('groupName');
    this.captionType = localStorage.getItem('captionType');
    this.ClientLogo = localStorage.getItem('ClientLogo');
    this.adminMaster = localStorage.getItem('AdminMaster');

     this.dynamicMenus = JSON.parse(localStorage.getItem('responseData')) || [];

     this.filterMenus();
  }



filterMenus() {
  if (this.userType === 'Admin' && this.adminMaster === '0') {
    this.dynamicMenus = this.dynamicMenus.filter(menu =>
      menu.captionName !== 'Sales' && menu.captionName !== 'CustomerCharges'
    );
  }
}

hasSubMenu(parentName: string): boolean {
  return this.dynamicMenus.some(
    item => item.captionType === 'Sub_Menu' && item.groupName === parentName
  );
}

isParentActive(parentName: string): boolean {
  const currentRoute = this.router.url;

  return this.dynamicMenus.some(
    item =>
      item.captionType === 'Sub_Menu' &&
      item.groupName === parentName &&
      currentRoute.endsWith(item.Routing)

  );
}

closeSidebarOnMobile(route?: string) {
  if (route && this.router.url === route) {
      this.openSnackBar('You are already on this page.', 'info-snackbar');
    } else if (route) {
      this.router.navigate([route]);
    }
  if (this.isMobileMenu()) {
    this.closeMenu.emit();
  }
}
 isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
    navigateTo(path: string) {
      if (!path) return;
      this.router.navigate([path]);
    }

  onMenuOpened(menu: any) {
      // When submenu opens → DO NOT close sidebar (mobile or desktop)
      if (this.hasSubMenu(menu.captionName)) {
        return;  // Prevent any sidebar closing
      }
    }

  // onMenuOpened(opened: MatMenuTrigger) {
  //     this.allTriggers.forEach(trigger => {
  //       if (trigger !== opened) {
  //         try {
  //           trigger.closeMenu();
  //         } catch (e) {}
  //       }
  //     });
  //   }


    preventLogout(event: Event): void {
      event.preventDefault();
      event.stopPropagation();
    }

    isRouteActive(route: string): boolean {
      return this.router.isActive(route, true);
    }
    logOut() {
      localStorage.clear();
      localStorage.removeItem('selectedValue');
      this.storedValue = 'All';
      localStorage.removeItem('userType');
      localStorage.removeItem('userName');
      localStorage.removeItem('token');
      localStorage.removeItem('CompanyPrint');
      localStorage.removeItem('isLoggedIn');
      this.clearAllCookies();
      this.router.navigate(['/auth/login']);
      this.openSnackBar( 'Logout successfully.', 'custom-snackbar')
    }

    clearAllCookies() {
      const cookies = document.cookie.split(';');

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      }
    }

    openSnackBar(message: string, panelClass: string) {
      this.snackBar.open(message, 'Ok', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [panelClass]
      });
    }
    OpenBranchModal(item: any) {
      if (item.captionName === 'User') {
        this.openUserModal();
      } else if (item.captionName === 'DocketPrint') {
        this.openPrintingModal();
      }
    }
    OpenCustomerModal(item: any) {
      if (item.captionName === 'DocketPrint') {
        this.openPrintingModal();
      }
    }
    OpenAdminhModal(item: any) {
      if (item.captionName === 'User') {
        this.openAdminUserModal();
      } else if (item.captionName === 'DocketPrint') {
        this.openPrintingModal();
      }
    }
    openPrintingModal() {
      const dialogRef = this.dialog.open(DocketPrintComponent, {
        data: {
          action: 'add'
        },
        width: '25rem',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
        }
      });
    }

    
    openUserModal() {
      const dialogRef = this.dialog.open(UserComponent, {
        data: {
          action: 'add'
        },
        width: '40rem',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
        }
      });
    }
    openAdminUserModal() {
      const dialogRef = this.dialog.open(AdminManagementComponent, {
        data: {
          action: 'add'
        },
        width: '40rem',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
        }
      });
    }

  search(data, type ) {
    if (data === '') {
     this.openSnackBar('Please enter AWB number.', 'error-snackbar')
     return;
   } else {
     if (type === 'refNo' && data !== null) {
       this.router.navigate(['/Tracking', { value: data, type: 'Ref' }]);
     } else {
       this.router.navigate(['/Tracking', { value: data, type: 'Awb' }]);
     }
   }
 }
    
}