import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {CardModule} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {ProgressBar} from 'primeng/progressbar';
import {Button} from 'primeng/button';
import {SelectButton} from 'primeng/selectbutton';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    CardModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    InputText,
    FormsModule,
    ProgressBar,
    Button,
    SelectButton
  ],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
