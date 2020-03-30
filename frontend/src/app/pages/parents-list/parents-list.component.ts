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
        this.parents = parents
      })
    }

  ngOnInit() {
  }


  public addNewRelative(): void {
    const dialogRef = this.dialog.open(AddRelativeDialogComponent, {
      width: '250px',
      data : {id : null, password : "", label : ""}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.apiService.addDossierToUser(result.id, result.password, result.label)
        .subscribe(response => {
          if(response.status == 200){
            this.parents.push({id : result.id, label : result.label})
          }
          if(response.status == 409){
            console.log(`Dossier ${result.id} is waiting activation`)
          }
        }, error => console.log(error))
    });
  }

}
