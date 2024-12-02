import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  constructor(private dialogRef: MatDialogRef<ErrorModalComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
