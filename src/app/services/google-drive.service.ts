import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface UploadResult {
  status: 'progress' | 'success';
  percentage?: number;
  data?: any;
  level: number;
}

export interface ExistFile {
  exist: boolean
}

export interface FileId {
  fileId: string;
}

const MAX_LEVEL = 5;

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private apiUrl = 'https://ares-m9marvrg7-rikymeggios-projects.vercel.app/api/drive'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<UploadResult> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<FileId>(`${this.apiUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => this.getEventMessage(event)),
      catchError(this.handleError)
    );
  }

  async existFile(fileName: string): Promise<ExistFile> {
    return await this.http.get<ExistFile>(`${this.apiUrl}/exist/${fileName}`).toPromise() as ExistFile;
  }

  private getEventMessage(event: HttpEvent<any>): UploadResult {
    const level = event.type;
    const percentage = Math.round((100 / MAX_LEVEL) * (level + 1));
    switch (event.type) {
      case HttpEventType.Sent:
        // Handle request sent (type 0)
        return { status: "progress", percentage, level };
      case HttpEventType.UploadProgress:
      // Handle upload progress (type 1)
        return { status: "progress", percentage, level };
      case HttpEventType.ResponseHeader:
        // Handle download progress (type 3)
        return { status: "progress", percentage, data: (event as unknown as HttpResponse<any>).headers, level };        
      case HttpEventType.DownloadProgress:
        // Handle download progress (type 3)
        return { status: "progress", percentage, level };
      case HttpEventType.Response:
        // Handle final response (type 4)
        return { status: "success", percentage, data: (event as HttpResponse<any>).body, level };
      default:
        return { status: "progress", percentage, level };
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}