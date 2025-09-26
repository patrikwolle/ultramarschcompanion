import { CommonModule } from "@angular/common";
import { NgModule, isDevMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { NgOptimizedImage } from "@angular/common";
import { HttpClientJsonpModule, HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { ServiceWorkerModule } from "@angular/service-worker";
import Aura from "@primeng/themes/aura";
import { Avatar } from "primeng/avatar";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { providePrimeNG } from "primeng/config";
import { DatePicker } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { FileUpload } from "primeng/fileupload";
import { FloatLabel } from "primeng/floatlabel";
import { InputText } from "primeng/inputtext";
import { Menubar } from "primeng/menubar";
import { ProgressBarModule } from "primeng/progressbar";
import { SelectButtonModule } from "primeng/selectbutton";
import { SpeedDial, SpeedDialModule } from "primeng/speeddial";
import { FriendComponent } from "./components/friend/friend.component";
import { MainComponent } from "./components/main/main.component";
import { UploadDialogComponent } from "./dialogs/upload-dialog/upload-dialog.component";
import { UploadedFilesComponent } from "./dialogs/uploaded-files/uploaded-files.component";

@NgModule({
  declarations: [
    MainComponent,
    AppComponent,
    UploadDialogComponent,
    UploadedFilesComponent,
  ],
  imports: [
    CommonModule,
    FriendComponent,
    CardModule,
    BrowserModule,
    SpeedDialModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    InputText,
    FormsModule,
    ButtonModule,
    DialogModule,
    DynamicDialogModule,
    SelectButtonModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
    ProgressBarModule,
    NgOptimizedImage,
    FloatLabel,
    Menubar,
    Avatar,
    DatePicker,
    FileUpload,
    MatIconModule,
    SpeedDial,
  ],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || "none",
        },
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
