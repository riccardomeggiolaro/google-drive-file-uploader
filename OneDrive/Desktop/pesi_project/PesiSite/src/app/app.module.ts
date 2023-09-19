import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UsersComponent } from './components/users-page/users/users.component';
import { UserTableComponent } from './components/users-page/user-table/user-table.component';
import { UserFilterComponent } from './components/users-page/user-filter/user-filter.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MyAccountComponent } from './components/my-account-page/my-account/my-account.component';
import { LoginComponent } from './components/login/login.component';
import { AddUserComponent } from './components/dialogs/add-user/add-user.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { IfAuthenticatedDirective } from './directives/if-authenticated.directive';
import { IfAdminDirective } from './directives/if-admin.directive';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { InstallationsComponent } from './components/installations-page/installations/installations.component';
import { InstallationTableComponent } from './components/installations-page/installation-table/installation-table.component';
import { InstallationFilterComponent } from './components/installations-page/installation-filter/installation-filter.component';
import { AddInstallationComponent } from './components/dialogs/add-installation/add-installation.component';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { DatetimePipe } from './pipes/datetime.pipe';
import { ConfirmComponent } from './components/dialogs/confirm/confirm.component';
import { ChangePasswordComponent } from './components/my-account-page/change-password/change-password.component';
import { SubjectsComponent } from './components/subjects-page/subjects/subjects.component';
import { SubjectTableComponent } from './components/subjects-page/subject-table/subject-table.component';
import { SubjectFilterComponent } from './components/subjects-page/subject-filter/subject-filter.component';
import { AddSubjectComponent } from './components/dialogs/add-subject/add-subject.component';
import { CardsComponent } from './components/cards-page/cards/cards.component';
import { CardTableComponent } from './components/cards-page/card-table/card-table.component';
import { CardFilterComponent } from './components/cards-page/card-filter/card-filter.component';
import { AddCardComponent } from './components/dialogs/add-card/add-card.component';
import { AddEventComponent } from './components/dialogs/add-event/add-event.component';
import { EventsComponent } from './components/events-page/events/events.component';
import { EventTableComponent } from './components/events-page/event-table/event-table.component';
import { EventFilterComponent } from './components/events-page/event-filter/event-filter.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StringPipe } from './pipes/string.pipe';
import { TypeUserPipe } from './pipes/type-user.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    UsersComponent,
    UserTableComponent,
    UserFilterComponent,
    NotFoundComponent,
    MyAccountComponent,
    LoginComponent,
    AddUserComponent,
    IfAuthenticatedDirective,
    IfAdminDirective,
    InstallationsComponent,
    InstallationTableComponent,
    InstallationFilterComponent,
    AddInstallationComponent,
    YesNoPipe,
    DatetimePipe,
    ConfirmComponent,
    ChangePasswordComponent,
    SubjectsComponent,
    SubjectTableComponent,
    SubjectFilterComponent,
    AddSubjectComponent,
    CardsComponent,
    CardTableComponent,
    CardFilterComponent,
    AddCardComponent,
    AddEventComponent,
    EventsComponent,
    EventTableComponent,
    EventFilterComponent,
    StringPipe,
    TypeUserPipe
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
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
