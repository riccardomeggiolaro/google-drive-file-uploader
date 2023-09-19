import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { JwtService } from './services/jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'PesiSite';

  constructor(private authSrv: AuthService,
              private jwtSrv: JwtService){}

  ngOnInit(): void {
    this.authSrv.fetchUser().subscribe();
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    if(this.jwtSrv.hasToken()){
      this.authSrv.lastAccess("offline");
    }
  }
}
