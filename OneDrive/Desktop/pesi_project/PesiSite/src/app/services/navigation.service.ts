import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private history = "";
  private _current$ = new BehaviorSubject<string | null>(null);
  
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history = event.urlAfterRedirects;
        this._current$.next(event.url);
        localStorage.setItem("lastPage", this.history);
      }
    });
  }

  current(): string | null {
    return this._current$.value;
  }

  isPageWithoutSideBar(): boolean{
    return this.current() === '/login' || this.current() === '/' || this.current() === '/404';
  }

  back(): void {
    const lastPage = localStorage.getItem("lastPage");
    if(lastPage){
      this.router.navigateByUrl(lastPage);
    }else{
      this.router.navigateByUrl("/events")
    }
  }
}
