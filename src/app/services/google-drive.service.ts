import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, map, tap, throwError } from 'rxjs';

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
  public progress$ = new Subject<number>();
  public upload$ = new Subject<any>();

  constructor(private http: HttpClient) { }

  upload(formData: FormData): Observable<any> {
    return new Observable<string>(observer => {
      const fetchData = async () => {
        const response = await fetch(`${this.apiUrl}/upload`, {
          method: 'POST',
          headers: {
          },
          body: formData // Convertiamo l'oggetto body in una stringa JSON
        });

        const reader = response.body!
          .pipeThrough(new TextDecoderStream())
          .getReader();

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            observer.next(value); // Emettiamo il valore ricevuto
          }
        } catch (error) {
          observer.error(error); // Gestiamo gli errori
        } finally {
          observer.complete(); // Completiamo l'Observable quando la lettura è terminata
        }
      };

      fetchData();
    });
  }

  async existFile(fileName: string): Promise<{exist: boolean}> {
    return await this.http.get<{exist: boolean}>(`${this.apiUrl}/exist/${fileName}`).toPromise() as {exist: boolean};
  }
}