import { Component, Inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './components/register-dialog/register-dialog.component';
import { AuthService } from './services/auth/auth.service';
import { ApiService } from './services/api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CodeVSCovid';

  public isLoggedIn = false;
  public isNurse = true;
  
  constructor (  public location: Location, public dialog : MatDialog,
    private authService : AuthService, private apiService : ApiService) {
    this.isLoggedIn = authService.isAuthenticated();
    this.isNurse = authService.isNurse();
  }

  

  public goBack() : void {
    this.location.back();
  }

  public openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '250px',
      data : {email : "", password : ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The Login Dialog was closed');
      console.log(result);
      this.apiService.login(result.email,result.password)
        .subscribe(user => {
          console.log(user);
          localStorage.setItem("token",JSON.stringify({id: user.id, isNurse : user.isNurse}));
          window.location.reload();
        })
    });
  }


  public openRegisterDialog(): void {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      width: '250px',
      data : {email : "", password : "", passwordCheck : "", role : true}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The Registration Dialog was closed');
      console.log(result);
      this.apiService.registerUser(result.email, result.password, result.role)
        .subscribe(id => {
          localStorage.setItem("token",JSON.stringify({id: id, isNurse : result.role}))
          window.location.reload();
        })
    });
  }

}
