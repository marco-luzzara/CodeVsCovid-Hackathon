import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewsComponent } from './pages/news/news.component';
import { ParentsListComponent } from './pages/parents-list/parents-list.component';
import { ParentsDetailsComponent } from './pages/parents-details/parents-details.component';
import { PatientChannelComponent } from './pages/patient-channel/patient-channel.component';
import { ScannerComponent } from './pages/scanner/scanner.component';

//Material components
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { MessageComponent } from './components/message/message.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRippleModule} from '@angular/material/core';

//QR scanner
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ShortNumberPipe } from './pipes/short-number.pipe';

const MATERIAL_MODULES = [
  MatTabsModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatBadgeModule,
  MatInputModule,
  MatFormFieldModule,
  MatRippleModule
]

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    ParentsListComponent,
    ParentsDetailsComponent,
    PatientChannelComponent,
    ScannerComponent,
    MessageComponent,
    ShortNumberPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ZXingScannerModule,
    ...MATERIAL_MODULES
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
