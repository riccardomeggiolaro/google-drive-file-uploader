import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { AuthService, User } from 'src/app/services/auth.service';
import { UserFilter, UsersService } from 'src/app/services/users.service';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';
import { get } from 'lodash';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['username', 'able', 'accessLevel', 'lastAccess', 'installation.installationCode', 'installation.description', 'actions'];
  dataSource: MatTableDataSource<User>;
  filter: UserFilter | null | undefined;
  private destroyed$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private usersSrv: UsersService,
              private authSrv: AuthService,
              private dialog: MatDialog) {
      this.dataSource = new MatTableDataSource();
      this.dataSource.sortingDataAccessor = get;
      this.dataSource.sort = this.sort;
    }

  ngOnInit(): void {
    this.usersSrv.users$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((users) => {
        this.dataSource.data = users;
        this.dataSource._updateChangeSubscription();
      })   
    this.usersSrv.filters$.subscribe((value) => {
      this.filter = value;
    })
    this.usersSrv.actions$.subscribe(value => {
      if(this.paginator){
        if(value === "filter") this.paginator!.firstPage();
        if(value === "add") this.paginator!.lastPage();
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  delete(username: string){
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {action: `Eliminare ${username}`},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.usersSrv.delete(username)
        .pipe(
          catchError(err => throwError(err))
        )
        .subscribe()
      }
    });
  }

  disable(username: string, able: boolean){
    this.usersSrv.disable(username, able)
      .pipe(
        catchError(err => throwError(err))
      )
      .subscribe()
  }

  isMeOrCan(username: string, accessLevel: number): boolean{
    const user = this.authSrv.getUser();
    return username === user?.username! || accessLevel >= user!.accessLevel;
  }
}