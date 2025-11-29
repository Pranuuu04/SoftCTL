import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { HttpService } from 'app/service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { SharedService } from 'app/service/shared.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    @Output() branchTypeChange = new EventEmitter<string>();
    userType = 'Admin';
    branchType = 'All';
    branchList: any[] = [];

    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    originName: any;
    ClientLogo: any;
    customerName: any;
    searchValue = '';
    searchType = 'Awb No.';
    toDate: any;
    fromDate: any;
    searchDisable = true;
    firstOfMonth: any;
    selectedValue: any;
    isDashboardPage = false;
    isBookingPage = false;
    storedValue: string;
  currentDate: string;


    constructor(location: Location,
                private element: ElementRef,
                private sharedService: SharedService,
                private router: Router,
                public httpService: HttpService,
                private snackBar: MatSnackBar, ) {
                  this.router.events.pipe(
                    filter(event => event instanceof NavigationEnd)
                  ).subscribe((event: NavigationEnd) => {
                    this.isDashboardPage = event.urlAfterRedirects === '/dashboard';
                    this.isBookingPage = event.urlAfterRedirects === '/Booking';
                    this.branchType = this.sharedService.getSelectedValue();  // Get updated branchType

                    if (!this.isBookingPage && this.isDropdownEnabled()) {
                      // this.branchType = 'All';
                      // localStorage.setItem('selectedValue', this.branchType);
                      this.sharedService.updateSelectedValuee(this.branchType);
                      // this.storedValue = localStorage.getItem('selectedValue');
                    } else {
                      // this.branchType = 'All';
                      // localStorage.setItem('selectedValue', this.branchType);
                      this.sharedService.updateBranchType(this.branchType);
                      // this.storedValue = localStorage.getItem('selectedValue');
                    }
                  });
                  this.location = location;
                  this.sidebarVisible = false;
                  this.fromDate = this.getDefaultDate();
                  this.toDate = this.getCurrentDate();
                  localStorage.setItem('fromDate', this.fromDate);
                  localStorage.setItem('toDate', this.toDate);
                  this.sharedService.setFromDate(this.fromDate);
                  this.sharedService.setToDate(this.toDate);
                }

    ngOnInit() {
      this.loadDestination();
      this.originName = localStorage.getItem('originName');
      this.userType = localStorage.getItem('userType');
      this.customerName = localStorage.getItem('customerName');

      this.ClientLogo = localStorage.getItem('ClientLogo')
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
      this.router.events.subscribe((event) => {
        this.sidebarClose();
         var $layer: any = document.getElementsByClassName('close-layer')[0];
         if ($layer) {
           $layer.remove();
           this.mobile_menu_visible = 0;
         }
     });
    }

    onDateChange() {
      this.sharedService.setFromDate(this.fromDate);
      this.sharedService.setToDate(this.toDate);
    }
    getDefaultDate(): string {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return this.formatDate(firstDayOfMonth);
    }

    getCurrentDate(): string {
      const today = new Date();
      return this.formatDate(today);
    }

    formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

 onBranchTypeChange(event: any) {

  // const selectedCode = event.target.value || 'All';
  const selectedCode = event.target.value == null ? 'All' : event.target.value;
  console.log("Change fired Value is >>>>",selectedCode);

  localStorage.setItem('selectedValue', selectedCode);
  this.sharedService.updateSelectedValuee(selectedCode);
  this.sharedService.updateSelectedValue(selectedCode);

  if (selectedCode !== 'All') {
    const selectedBranch = this.branchList.find(branch => branch.locationCode === selectedCode);
    if (selectedBranch) {
      localStorage.setItem('selectedLocationName', selectedBranch.locationName);
    }
  } else {
    localStorage.setItem('selectedLocationName', 'All Branch');
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
  isDropdownEnabled() {
    // Enable the dropdown only for the BookingComponent
    return this.isBookingPage || this.isDashboardPage;
  }
    preventLogout(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
      }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function() {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];
        if (this.mobile_menu_visible == 1) {
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }
            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { // asign a function
              body.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;
        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
          titlee = titlee.slice(1);
        }
        for (var item = 0; item < this.listTitles.length; item++) {
          if (this.listTitles[item].path === titlee) {
            return this.listTitles[item].title;
          }
        }
        if (this.userType === 'Customer') {
          return this.customerName;
        } else if (this.userType === 'Admin') {
          return '';
        }
        return this.originName;
      }

    // getLogo(){
    //     this.httpService.get(`https://www.neotechnet.com/NISTrackCTL/softCTLPermmision?clientURL=${environment.apiUrl}`)
    //     .then((resp) => {
    //       this.ClientLogo = resp.Data[0].logoUrl;
    //     }, (error) => {
    //       console.error(error);
    //     });
    //   }
  logOut() {
    localStorage.clear();
    localStorage.removeItem('selectedValue');
    this.storedValue = 'All';
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
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

  async loadDestination() {
    try {
      const resp = await this.httpService.get(`${environment.apiUrl}Booking/getBranch`);

      this.branchList = resp.Data;
    } catch (error) {
      console.error('Error in loadDestination:', error);
      throw error;
    }
  }

// disable searchinput

  // search(data, type ) {
  //   if(type!==null){
  //     this.searchDisable == true;
  //   }
  //  if (type === 'refNo' && data!==null) {
  //       this.router.navigate(["/Tracking", { value: data, type: 'Ref' }]);
  //     } else {
  //       this.router.navigate(["/Tracking", { value: data, type: 'Awb' }]);
  //     }
  //   }

}
