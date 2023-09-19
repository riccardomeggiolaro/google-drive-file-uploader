import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Event, EventFilter, EventsService } from 'src/app/services/events.service';
import { ConfirmComponent } from '../../dialogs/confirm/confirm.component';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TableUtil } from 'src/assets/tableUtil';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'
import { get } from 'lodash';

interface PeriodicElement {
  dt_create: Date | string;
  cardCode: string;
  plate: string;
  socialReason: string;
  pid1_pid2_: string;
  weight1: number;
  weight2: number;
  netWeight: number;
  material: string;
  installationCode: string;
  actions: any;
  note1: string;
  note2: string;
}

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EventTableComponent implements OnDestroy {
  displayedColumns: string[] = ['dt_create', 'cardCode', 'plate', 'subject.socialReason', 'pid1_pid2', 'weight1', 'weight2', 'netWeight', 'material', 'installation.installationCode', 'actions'];
  dataSource: MatTableDataSource<Event>;
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement!: PeriodicElement | null;
  filter: EventFilter | null | undefined;

  private destroyed$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  constructor(private eventsSrv: EventsService,
              private dialog: MatDialog) {
      this.dataSource = new MatTableDataSource();
      this.dataSource.sortingDataAccessor = get
      this.dataSource.sort = this.sort;
    }

  ngOnInit(): void {
    this.eventsSrv.events$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((events) => {
        this.dataSource.data = events;
        this.dataSource._updateChangeSubscription();
      })   
    this.eventsSrv.filters$.subscribe((value) => {
      this.filter = value;
    })
    this.eventsSrv.actions$.subscribe(value => {
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

  exportArray(ext: "xlsx" | "csv" | "pdf") {
    const onlyNameAndSymbolArr: Partial<any>[] = this.dataSource.data.map(x => {
      const k = x as any;
      return [
        new Date(k.dt_create).toLocaleString(),
        k.card?.cardCode,
        k.card?.plate,
        k.card?.subject?.socialReason,
        k.pid1 + "\n" + x.pid2,
        k.weight1,
        k.weight2,
        k.netWeight,
        k.material,
        k.installation.installationCode,
        k.note1,
        k.note2
      ]
    })
    const Headers = ["Data", "Codice Carta", "Targa", "Ragione Sociale", "Pid1/Pid2", "Peso1", "Peso2", "Peso Netto", "Materiale", "Codice Installazione", "Note1", "Note2"]
    if(ext === "xlsx" || ext === "csv"){
      TableUtil.exportArray(Headers, onlyNameAndSymbolArr, ext);
    }else{
      TableUtil.generatePDF(Headers, onlyNameAndSymbolArr);
    }
  }

  delete(id: number){
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {action: `Eliminare questo evento`},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.eventsSrv.delete(id)
        .pipe(
          catchError(err => throwError(err))
        )
        .subscribe()
      }
    });
  }
}
