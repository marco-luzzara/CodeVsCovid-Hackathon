import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnInit {
  
  @Input('messagetext') text : string;
  @Input('canBeDeleted') canBeDeleted : boolean;
  
  constructor() { }

  ngOnInit() {
    console.log(this.text);
  }


}
