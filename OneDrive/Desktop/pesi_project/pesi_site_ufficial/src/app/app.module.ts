import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Routes }   from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UsersComponent } from './components/users-page/users/users.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { IfAdminDirective } from './directives/if-admin.directive';
import { IfAuthenticatedDirective } from './directives/if-authenticated.directive';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from "@angular/forms";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { EventsComponent } from './components/events-page/events/events.component';
import { CardsComponent } from './components/cards-page/cards/cards.component';
import { SubjectsComponent } from './components/subjects-page/subjects/subjects.component'
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {MatStepperModule} from '@angular/material/stepper';
import {MatPaginatorModule} from '@angular/material/paginator';
import { UserFilterComponent } from './components/users-page/user-filter/user-filter.component';
import { UserTableComponent } from './components/users-page/user-table/user-table.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { MatSliderModule } from '@angular/material/slider';
import { MatBadgeModule } from '@angular/material/badge';
import { AddUserComponent } from './components/dialogs/add-user/add-user.component';
import { InstallationTableComponent } from './components/installations-page/installation-table/installation-table.component';
import { InstallationsComponent } from './components/installations-page/installations/installations.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    UsersComponent,
    NotFoundComponent,
    LoginComponent,
    IfAdminDirective,
    IfAuthenticatedDirective,
    EventsComponent,
    CardsComponent,
    SubjectsComponent,
    UserFilterComponent,
    UserTableComponent,
    AddUserComponent,
    InstallationTableComponent,
    InstallationsComponent
  ],
  imports: [
    MatBadgeModule,
    MatSliderModule,
    MatSortModule,
    MatAutocompleteModule,
    MatSelectModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatExpansionModule,
    MatTooltipModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatCardModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatStepperModule,
    MatPaginatorModule
  ],
  providers: [   
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
