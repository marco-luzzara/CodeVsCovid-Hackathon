import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent {

  constructor(public router: Router, private apiService : ApiService) { }

  public scanSuccess(output) {
    console.log("Scan Output: ",output);
    this.apiService.activateDossier(output).subscribe(resp => {
      if(resp.status == 200 || resp.status == 409){
        this.router.navigateByUrl(`/patient/${output}`);
      }
    }, error => console.log(error))
 
  }
}
