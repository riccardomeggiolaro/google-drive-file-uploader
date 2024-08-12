import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, throwError } from 'rxjs';

interface UploadResult {
  status?: string;
  percentage?: number;
  progress?: number;
  data?: any;
  level?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private apiUrl = 'http://localhost:3000/api/drive'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  upload(formData: FormData): Observable<UploadResult> {
    return this.http.post(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = Math.round(100 * event.loaded / (event.total || 1));
            return { status: 'progress', progress };
          case HttpEventType.Response:
            return { status: 'complete', message: 'Upload completato con successo' };
          default:
            return { status: 'unknown', message: `Evento sconosciuto: ${event.type}` };
        }
      })
    );
  }

  async existFile(fileName: string): Promise<{exist: boolean}> {
    return await this.http.get<{exist: boolean}>(`${this.apiUrl}/exist/${fileName}`).toPromise() as {exist: boolean};
  }
}