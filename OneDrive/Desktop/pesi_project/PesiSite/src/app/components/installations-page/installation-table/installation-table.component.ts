import { Component, ViewChild, AfterViewInit, Output, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { Installation, InstallationFilter, InstallationsService } from 'src/app/services/installations.service';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-installation-table',
  templateUrl: './installation-table.component.html',
  styleUrls: ['./installation-table.component.css']
})
export class InstallationTableComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = ['installationCode', 'description', 'imei', 'actions'];
  dataSource: MatTableDataSource<Installation>;
  filter: InstallationFilter | null | undefined;

  private destroyed$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private installationsSrv: InstallationsService,
              private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.installationsSrv.installations$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((installations) => {
        this.dataSource.data = installations;
        this.dataSource._updateChangeSubscription();
      })   
    this.installationsSrv.filters$.subscribe((value) => {
      this.filter = value;
    })
    this.installationsSrv.actions$.subscribe(value => {
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

  delete(id: number){
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {action: "Eliminare questa installazione"},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.installationsSrv.delete(id)
        .pipe(
          catchError(err => throwError(err))
        )
        .subscribe();
      }
    });
  }
}