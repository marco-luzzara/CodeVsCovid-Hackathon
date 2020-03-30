import { Component, OnInit } from '@angular/core';
import { Parent } from 'src/app/models/parent';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { Message } from '../../models/message';

const MESSAGES : string[] = [
  "tutto bene",
  "respirazione ok",
  "paziente dimesso",
  "Peggioramento in corso"
]

const PARENT : Parent = {
  id : 123,
  patientLabel : "Mario Rossi",
  /*
  name : "Mario",
  surname : "Rossi",
  fiscalCode : "123ABCQWERTY",
  isNewMessage : false
  */
}

const TIPS_MESSAGES : string[] = [
  "Patient is doing progresses",
  "Patient is going worse",
  "Patient is cured"
]

@Component({
  selector: 'app-patient-channel',
  templateUrl: './patient-channel.component.html',
  styleUrls: ['./patient-channel.component.css']
})
export class PatientChannelComponent implements OnInit {
  public messages : Message[];
  public newMessage : string;
  public patientLabel : string;
  private dossierId : number;
  public tipsMessages : string[];
  private scrolled : boolean;
  private messageList : HTMLElement;

  constructor(private route: ActivatedRoute, 
    private apiService : ApiService,
    private router : Router) {
    
    const dossierId = +this.route.snapshot.paramMap.get('id');
    this.dossierId = dossierId;
    this.tipsMessages = TIPS_MESSAGES;
    this.scrolled = false;

    this.apiService.getRelatives()
      .subscribe((relatives : Parent[]) => {
        const found = relatives.find(r => r.id == dossierId);
        if(found){
          
          this.patientLabel = found.patientLabel;
          console.log(this.patientLabel);
        }
        else {
          this.router.navigateByUrl('/parentslist');
        }
      })
    
    this.apiService.getDossier(dossierId)
      .subscribe((resp) => {
        resp.messages.reverse();
        const msgs : Message[] = resp.messages;
        msgs.forEach(msg => msg.timestamp = new Date(Date.parse(msg.timestamp)).toUTCString())
        this.messages = msgs
      });
  }
  
  ngOnInit() {
    this.messageList = document.getElementById('messageList')
    
    setTimeout(this.updateScroll,100,this.messageList)
  }

  private updateScroll(messageList : HTMLElement){
        messageList.scrollTop = messageList.scrollHeight;
  }


  sendMessage(message) {
    const msgToSend = message || this.newMessage;

    this.apiService.sendMessage(this.dossierId, msgToSend).subscribe(resp => {
      if(resp.status == 200){
        this.messages.push({
          dossierId : "" + this.dossierId,
          message : msgToSend,
          timestamp : new Date().toUTCString(),
          userId : null
        });
      }
      this.newMessage = "";
    })
  }
}
