import { Component, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  public getScreenWidth: any;

  constructor(
    protected navigation: NavigationService,
    protected authSrv: AuthService
  ){}

  resizeComponent(): boolean{
    return this.navigation.isPageWithoutSideBar();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
  }
}