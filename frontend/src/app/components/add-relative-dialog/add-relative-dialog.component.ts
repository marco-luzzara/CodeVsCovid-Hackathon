import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Dossier } from 'src/app/models/dossier';



@Component({
  selector: 'app-add-relative-dialog',
  templateUrl: './add-relative-dialog.component.html',
  styleUrls: ['./add-relative-dialog.component.css']
})
export class AddRelativeDialogComponent {

  constructor(public dialogRef: MatDialogRef<AddRelativeDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Dossier){}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
