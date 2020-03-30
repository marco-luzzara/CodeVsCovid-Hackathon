import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Parent } from 'src/app/models/parent';
import { ApiService } from 'src/app/services/api/api.service';
import { Dossier } from 'src/app/models/dossier';

const MESSAGES : string[] = [
  "tutto bene",
  "respirazione ok",
  "paziente dimesso",
  "Peggioramento in corso"
]

const PARENT : Parent = {
  id : 123,
  label : "Mario Rossi"
  /*
  name : "Mario",
  surname : "Rossi",
  fiscalCode : "123ABCQWERTY",
  isNewMessage : false
  */
}

@Component({
  selector: 'app-parents-details',
  templateUrl: './parents-details.component.html',
  styleUrls: ['./parents-details.component.css']
})
export class ParentsDetailsComponent implements OnInit {
  public messages : string[];
  public label : string;
  
  constructor(private route: ActivatedRoute, 
    private apiService : ApiService,
    private router : Router) {

    const dossierId = +this.route.snapshot.paramMap.get('id');
    this.apiService.getRelatives()
      .subscribe((relatives : Parent[]) => {
        const found = relatives.find(r => r.id == dossierId);
        if(found){
          this.label = found.label;
        }
        else {
          this.router.navigateByUrl('/parentslist');
        }
      },
      error => this.router.navigateByUrl('/parentslist'))
    
    this.apiService.getDossier(dossierId)
      .subscribe(
        msgs => this.messages = msgs,
        error => this.router.navigateByUrl('/parentslist')
      );
  }

  ngOnInit() {
  }

}
