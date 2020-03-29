import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CodeVSCovid';

  public isLoggedIn = true;
  public isNurse = true;
  
  constructor (  public location: Location) {
    let str : string;
    
    location.onUrlChange(url => {
      console.log(location.isCurrentPathEqualTo('/scanner'))
      console.log(location.path())
    })
  }

  public goBack() : void {
    this.location.back();
  }
}
