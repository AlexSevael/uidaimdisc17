import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { Router, NavigationEnd, NavigationStart, RouterModule } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FooterComponent } from '../components/footer/footer.component';
declare const $: any;

@Component({
  standalone: true,
  imports: [CommonModule,RouterModule,SidebarComponent,NavbarComponent,FooterComponent],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    private yScrollStack: number[] = [];

    @ViewChild(NavbarComponent) navbar!: NavbarComponent;

  constructor( public location: Location, private router: Router ) { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
    var divHeight = $('.innerbodyScroll').height(); 
    console.log(divHeight)
  $('.filterby').css('height', divHeight+'px');
}
isMaps(path:any){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice( 1 );
    if(path == titlee){
        return false;
    }
    else {
        return true;
    }
}
runOnRouteChange(): void {
  if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
    const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
  }
}
isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
        bool = true;
    }
    return bool;
}

}
