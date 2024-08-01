import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { GoogleDriveService, UploadResult } from '../../services/google-drive.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  standalone: true,
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  imports: [
    NgIf,
    FontAwesomeModule,
    MatProgressBarModule
  ]
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private readonly googleDriveService: GoogleDriveService) {}

  faCloudUploadAlt = faCloudUploadAlt
  isDragging = false;
  selectedFile: File | null = null;
  isUploading = false;
  uploadSuccess = false;
  uploadError: string | null = null;
  uploading: boolean = false;
  uploaded: number | null = null;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onRemove(): void {
    this.selectedFile = null;
  }

  async uploadFile(): Promise<void> {
    if (this.selectedFile) {
      this.isUploading = true;
      this.uploadError = null;
      this.uploadSuccess = false;
      this.uploading = true;
      await this.googleDriveService.upload(this.selectedFile).forEach((value: UploadResult) => {
        this.uploaded = value.percentage!
      });
    }
  }

  reinit(): void {
    this.uploaded = null;
    this.uploading = false;
    this.selectedFile = null;
  }

  getFileName(): string {
    const max_name_length = 13;
    if (this.selectedFile) {
      const last_dot = this.selectedFile.name.lastIndexOf(".");
      const last_index = this.selectedFile.name.length;
      if (last_dot < max_name_length) return this.selectedFile.name;
      return this.selectedFile.name.substring(0, max_name_length) + ".." + this.selectedFile.name.substring(last_dot, last_index);
    }
    return "";
  }
}