import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewsComponent } from './pages/news/news.component';
import { ParentsListComponent } from './pages/parents-list/parents-list.component';
import { ParentsDetailsComponent } from './pages/parents-details/parents-details.component';
import { PatientChannelComponent } from './pages/patient-channel/patient-channel.component';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { FormsModule } from '@angular/forms';

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
import {MatDialogModule} from '@angular/material/dialog';
import {MatSliderModule} from '@angular/material/slider';

//QR scanner
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { RegisterDialogComponent } from './components/register-dialog/register-dialog.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/auth/token.interceptor';
import { AddRelativeDialogComponent } from './components/add-relative-dialog/add-relative-dialog.component';
import { FaqComponent } from './pages/faq/faq.component'

const MATERIAL_MODULES = [
  MatTabsModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatBadgeModule,
  MatInputModule,
  MatFormFieldModule,
  MatRippleModule,
  MatDialogModule,
  MatSliderModule
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
    ShortNumberPipe,
    LoginDialogComponent,
    RegisterDialogComponent,
    AddRelativeDialogComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ZXingScannerModule,
    HttpClientModule,
    FormsModule,
    ...MATERIAL_MODULES
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents : [
    LoginDialogComponent,
    RegisterDialogComponent,
    AddRelativeDialogComponent
  ]
})
export class AppModule { }
