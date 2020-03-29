import { Component, OnInit } from '@angular/core';
import { Parent } from '../../models/parent'

const PARENTS : Parent[] = [
  {
    id: 123,
    name : "Mario",
    surname : "Rossi",
    fiscalCode : "ABC123QWERTY",
    isNewMessage : false
  },
  {
    id: 456,
    name : "Luigi",
    surname : "Verdi",
    fiscalCode : "CDE456QWERTY",
    isNewMessage : true
  },
  {
    id : 789,
    name : "Luisa",
    surname : "Rossi",
    fiscalCode : "FGH789QWERTY",
    isNewMessage : false
  }
] 
@Component({
  selector: 'app-parents-list',
  templateUrl: './parents-list.component.html',
  styleUrls: ['./parents-list.component.css']
})
export class ParentsListComponent implements OnInit {

  public parents : Parent[] = PARENTS;

  constructor() { }

  ngOnInit() {
  }

}
