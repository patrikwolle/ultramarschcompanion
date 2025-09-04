import { NgModule, isDevMode } from '@angular/core';
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
import {ButtonModule} from 'primeng/button';
import {SelectButtonModule} from 'primeng/selectbutton';
import { ServiceWorkerModule } from '@angular/service-worker';
import {ProgressBar, ProgressBarModule} from 'primeng/progressbar';
import { FriendComponent } from './components/friend/friend.component';
import {DialogModule} from 'primeng/dialog';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import { GroupSelectDialogComponent } from './dialogs/group-select-dialog/group-select-dialog.component';
import {NgOptimizedImage} from '@angular/common';
import {FloatLabel} from 'primeng/floatlabel';
import {Menubar} from 'primeng/menubar';
import {Avatar} from 'primeng/avatar';
import { SettingsComponent } from './dialogs/settings/settings.component';
import { UploadDialogComponent } from './dialogs/upload-dialog/upload-dialog.component';
import {DatePicker} from 'primeng/datepicker';
import {FileUpload} from 'primeng/fileupload';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FriendComponent,
    GroupSelectDialogComponent,
    SettingsComponent,
    UploadDialogComponent
  ],
  imports: [
    CardModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    InputText,
    FormsModule,
    ButtonModule,
    DialogModule,
    DynamicDialogModule,
    SelectButtonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ProgressBarModule,
    NgOptimizedImage,
    FloatLabel,
    Menubar,
    Avatar,
    DatePicker,
    FileUpload
  ],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || 'none'
        }
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
