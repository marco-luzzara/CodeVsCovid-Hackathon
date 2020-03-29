import { Component, OnInit } from '@angular/core';
import { Parent } from 'src/app/models/parent';
import { ActivatedRoute } from '@angular/router';

const MESSAGES : string[] = [
  "tutto bene",
  "respirazione ok",
  "paziente dimesso",
  "Peggioramento in corso"
]

const PARENT : Parent = {
  id : 123,
  name : "Mario",
  surname : "Rossi",
  fiscalCode : "123ABCQWERTY",
  isNewMessage : false
}

@Component({
  selector: 'app-patient-channel',
  templateUrl: './patient-channel.component.html',
  styleUrls: ['./patient-channel.component.css']
})
export class PatientChannelComponent implements OnInit {
  public patientId : number; 
  public messages : string[];
  public parent : Parent;
  
  constructor(private route: ActivatedRoute) {
    this.patientId = +this.route.snapshot.paramMap.get('id');
    this.messages = MESSAGES;
    this.parent = PARENT;
  }
  ngOnInit() {
  }

}
