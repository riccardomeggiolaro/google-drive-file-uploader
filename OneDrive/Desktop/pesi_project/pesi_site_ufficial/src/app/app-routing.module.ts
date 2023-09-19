import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { UsersComponent } from './components/users-page/users/users.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { loggedGuard } from './guards/logged.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { EventsComponent } from './components/events-page/events/events.component';
import { CardsComponent } from './components/cards-page/cards/cards.component';
import { SubjectsComponent } from './components/subjects-page/subjects/subjects.component';
import { UsersResolver } from './resolvers/users.resolver';
import { UsersFiltersResolver } from './resolvers/users-filter.resolver';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loggedGuard],
    component: LoginComponent,
  },
  {
    path: 'my-account',
    canActivate: [authGuard],
    component: MyAccountComponent
  },
  {
    path: 'events',
    canActivate: [authGuard],
    component: EventsComponent
  },
  {
    path: 'cards',
    canActivate: [authGuard],
    component: CardsComponent
  },
  {
    path: 'subjects',
    canActivate: [authGuard],
    component: SubjectsComponent
  },
  { 
    path: 'installations',
    canActivate: [adminGuard],
    component: InstallationsComponent 
  },
  { 
    path: 'users',
    canActivate: [adminGuard],
    component: UsersComponent,
    resolve: {
      filters: UsersFiltersResolver,
      users: UsersResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
