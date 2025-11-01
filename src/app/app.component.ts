import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isloggedIn: boolean = false;
  constructor(
    private router: Router,
    private config: NgSelectConfig
  ) { 
    this.config.notFoundText = 'Custom not found';
    this.config.appendTo = 'body';
    this.config.bindValue = 'value';
  }

  ngOnInit() {
    // old  
    // if(localStorage.getItem('UserDetails') == null || localStorage.getItem('UserDetails') == '' || localStorage.getItem('UserDetails') == undefined) {
    //   $('#main').removeClass('toggled');
    //   this.router.navigate(['/auth/login']);
    // } else {
    //   this.isloggedIn = true;
    // }
    // main 
    // comment branch layOut ts  line no 57     //   ps = new PerfectScrollbar(elemSidebar);
    if(localStorage.getItem('userType') && localStorage.getItem('userName')) {
      this.isloggedIn = true;
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
