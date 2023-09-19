import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { Card, CardFilter, CardsService } from 'src/app/services/cards.service';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';
import { catchError, takeUntil, throwError, Subject } from 'rxjs';
import { Subject as iSubject } from 'src/app/services/subjects.service';
import { get, merge } from 'lodash';

export interface iCard {
  cardCode: string;
  vehicle: string;
  plate: string;
  tare: number;
  socialReason: string;
  installationCode: string;
  description: string;
}

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.css']
})
export class CardTableComponent implements OnDestroy {
  displayedColumns: string[] = ['cardCode', 'vehicle', 'plate', 'subject.socialReason', 'installation.installationCode', 'installation.description', 'actions'];
  dataSource: MatTableDataSource<Card>;
  filter: CardFilter | null | undefined;

  private destroyed$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private cardSrv: CardsService,
              private authSrv: AuthService,
              private dialog: MatDialog) {
      this.dataSource = new MatTableDataSource();
      this.dataSource.sortingDataAccessor = get; 
      this.dataSource.sort = this.sort;
    }

  ngOnInit(): void {
    this.cardSrv.cards$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((cards) => {
        this.dataSource.data = cards;
        this.dataSource._updateChangeSubscription();
      })   
    this.cardSrv.filters$.subscribe((value) => {
      this.filter = value;
    })
    this.cardSrv.actions$.subscribe(value => {
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
      data: {action: `Eliminare questo evento`},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.cardSrv.delete(id)
        .pipe(
          catchError(err => throwError(err))
        )
        .subscribe()
      }
    });
  }
}
