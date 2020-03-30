import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface RegistrationData {
  email : string;
  password : string;
  passwordCheck : string;
  role : boolean
}

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.css']
})
export class RegisterDialogComponent {


  constructor(public dialogRef: MatDialogRef<RegisterDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: RegistrationData){}

  onNoClick(): void {
    this.dialogRef.close();
  }


}
