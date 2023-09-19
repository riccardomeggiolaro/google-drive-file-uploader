import { Component, OnInit } from '@angular/core';
import { AuthService, User } from 'src/app/services/auth.service';
import { admin } from 'src/assets/global';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  user: User | undefined;
  tipo: "utente" | "amministratore" | "super-amministratore" = "utente";

  constructor(private authSrv: AuthService){}

  ngOnInit(): void {
    this.authSrv.fetchUser().subscribe(value => {
      this.user = value;
      if(this.user.accessLevel == admin) this.tipo = "amministratore";
      else if(this.user.accessLevel > admin) this.tipo = "super-amministratore";
    });
  }
}
