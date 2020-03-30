import { Component, OnInit } from '@angular/core';
import { Parent } from 'src/app/models/parent';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

const MESSAGES : string[] = [
  "tutto bene",
  "respirazione ok",
  "paziente dimesso",
  "Peggioramento in corso"
]

const PARENT : Parent = {
  id : 123,
  label : "Mario Rossi",
  /*
  name : "Mario",
  surname : "Rossi",
  fiscalCode : "123ABCQWERTY",
  isNewMessage : false
  */
}

@Component({
  selector: 'app-patient-channel',
  templateUrl: './patient-channel.component.html',
  styleUrls: ['./patient-channel.component.css']
})
export class PatientChannelComponent implements OnInit {
  public messages : string[];
  public newMessage : string;
  public label : string;
  private dossierId : number;

  constructor(private route: ActivatedRoute, 
    private apiService : ApiService,
    private router : Router) {

    const dossierId = +this.route.snapshot.paramMap.get('id');
    this.dossierId = dossierId;

    this.apiService.getRelatives()
      .subscribe((relatives : Parent[]) => {
        const found = relatives.find(r => r.id == dossierId);
        if(found){
          this.label = found.label;
        }
        else {
          this.router.navigateByUrl('/parentslist');
        }
      })
    
    this.apiService.getDossier(dossierId)
      .subscribe(msgs => this.messages = msgs);
  }
  
  ngOnInit() {
  }

  sendMessage() {
    console.log(this.newMessage);
    this.apiService.sendMessage(this.dossierId, this.newMessage).subscribe(resp => {
      if(resp.status == 201){
        this.messages.push(this.newMessage);
      }
    })
    this.newMessage = "";
  }
}
