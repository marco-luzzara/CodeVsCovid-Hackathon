import { Component, OnInit } from '@angular/core';
import { Parent } from '../../models/parent'
import { MatDialog } from '@angular/material/dialog';
import { AddRelativeDialogComponent } from 'src/app/components/add-relative-dialog/add-relative-dialog.component';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parents-list',
  templateUrl: './parents-list.component.html',
  styleUrls: ['./parents-list.component.css']
})
export class ParentsListComponent implements OnInit {

  public parents : Parent[];

  constructor( public dialog : MatDialog, 
    private apiService : ApiService,
    private router : Router) {
      this.apiService.getRelatives().subscribe(parents => {
        console.log(parents);
        this.parents = parents
      })
    }

  ngOnInit() {
  }


  public addNewRelative(): void {
    const dialogRef = this.dialog.open(AddRelativeDialogComponent, {
      width: '250px',
      data : {id : null, password : "", patientlabel : ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.apiService.addDossierToUser(result.id, result.password, result.patientlabel)
        .subscribe(response => {
          if(response.status == 200){
            console.log(`Dossier ${result.id} added to waiting list`)
          }
        }, error => {
          if(error.status == 409){
            console.log(`Dossier ${result.id} is waiting activation`)
          }
          else {
            console.log(error)
          }
        })
    });
  }

}
