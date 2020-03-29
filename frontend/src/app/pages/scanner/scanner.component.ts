import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public scanSuccess(output : string) {
    console.log("Scan Output: ",output);
  }
}
