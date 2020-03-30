import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

// Pages
import { NewsComponent } from './pages/news/news.component';
import { ParentsDetailsComponent } from './pages/parents-details/parents-details.component';
import { ParentsListComponent } from './pages/parents-list/parents-list.component';
import { PatientChannelComponent } from './pages/patient-channel/patient-channel.component';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { FaqComponent } from './pages/faq/faq.component';

const routes: Routes = [
  { path: '', component : NewsComponent},
  { path: 'news', component : NewsComponent},
  { path: 'covidfaq', component : FaqComponent},
  { path: 'parentdetail/:id', component: ParentsDetailsComponent, canActivate : [AuthService]},
  { path: 'parentslist', component: ParentsListComponent, canActivate : [AuthService]},
  { path: 'patient/:id', component: PatientChannelComponent, canActivate : [AuthService]},
  { path: 'scanner', component: ScannerComponent, canActivate : [AuthService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
