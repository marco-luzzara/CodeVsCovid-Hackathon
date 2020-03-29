import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Pages
import { NewsComponent } from './pages/news/news.component';
import { ParentsDetailsComponent } from './pages/parents-details/parents-details.component';
import { ParentsListComponent } from './pages/parents-list/parents-list.component';
import { PatientChannelComponent } from './pages/patient-channel/patient-channel.component';
import { ScannerComponent } from './pages/scanner/scanner.component';

const routes: Routes = [
  { path: 'news', component : NewsComponent},
  { path: 'parentdetail/:id', component: ParentsDetailsComponent},
  { path: 'parentslist', component: ParentsListComponent},
  { path: 'patient', component: PatientChannelComponent},
  { path: 'scanner', component: ScannerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
