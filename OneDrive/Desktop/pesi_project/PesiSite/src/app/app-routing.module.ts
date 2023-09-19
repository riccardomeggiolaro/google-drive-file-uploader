import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loggedGuard } from './guards/logged.guard';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { MyAccountComponent } from './components/my-account-page/my-account/my-account.component';
import { adminGuard } from './guards/admin.guard';
import { UsersComponent } from './components/users-page/users/users.component';
import { usersFilterResolver } from './resolvers/users-resolvers/users-filter.resolver';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { InstallationsComponent } from './components/installations-page/installations/installations.component';
import { installationsFilterResolver } from './resolvers/installations-resolvers/installations-filter.resolver';
import { installationsResolver } from './resolvers/installations-resolvers/installations.resolver';
import { usersResolver } from './resolvers/users-resolvers/users.resolver';
import { SubjectsComponent } from './components/subjects-page/subjects/subjects.component';
import { subjectsFilterResolver } from './resolvers/subjects-resolvers/subjects-filter.resolver';
import { subjectsResolver } from './resolvers/subjects-resolvers/subjects.resolver';
import { CardsComponent } from './components/cards-page/cards/cards.component';
import { cardsFilterResolver } from './resolvers/cards-resolvers/cards-filter.resolver';
import { cardsResolver } from './resolvers/cards-resolvers/cards.resolver';
import { EventsComponent } from './components/events-page/events/events.component';
import { eventsFiltersResolver } from './resolvers/events-resolvers/events-filters.resolver';
import { eventsResolver } from './resolvers/events-resolvers/events.resolver';

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
    component: EventsComponent,
    resolve: {
      filters: eventsFiltersResolver,
      events: eventsResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'cards',
    canActivate: [authGuard],
    component: CardsComponent,
    resolve: {
      filters: cardsFilterResolver,
      cards: cardsResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'subjects',
    canActivate: [authGuard],
    component: SubjectsComponent,
    resolve: {
      filters: subjectsFilterResolver,
      subjects: subjectsResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  { 
    path: 'installations',
    canActivate: [adminGuard],
    component: InstallationsComponent,
    resolve: {
      filters: installationsFilterResolver,
      installations: installationsResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  { 
    path: 'users',
    canActivate: [adminGuard],
    component: UsersComponent,
    resolve: {
      filters: usersFilterResolver,
      users: usersResolver
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
