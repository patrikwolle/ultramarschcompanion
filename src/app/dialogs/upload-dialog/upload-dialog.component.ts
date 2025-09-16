import { formatDate } from "@angular/common";
import { Component } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { LocalStorageService } from "../../services/local-storage.service"; // ← Pfad ggf. anpassen
import { UmServiceService } from "../../services/um-service.service";

@Component({
  selector: "app-upload-dialog",
  standalone: false,
  templateUrl: "./upload-dialog.component.html",
  styleUrl: "./upload-dialog.component.scss",
})
export class UploadDialogComponent {
  date: Date = new Date();
  length: string = "";
  height: string = "";
  bikeLength: string = "";
  bikeHeight: string = "";
  image: any;
  userToken: string = "";
  tokenLocked = false;

  constructor(
    private ref: DynamicDialogRef,
    private um: UmServiceService,
    private ls: LocalStorageService
  ) {
    this.userToken = ls.getToken();
  }

  ngOnInit(): void {
    const saved = this.ls.getToken?.();
    if (saved) {
      this.userToken = saved;
      this.tokenLocked = true;
    }
  }

  toggleToken(): void {
    if (this.tokenLocked) {
      this.tokenLocked = false;
      return;
    }
    if (this.userToken.trim().length > 0) {
      this.ls.addToken?.(this.userToken);
      this.tokenLocked = true;
    }
  }

  saveSettings(): void {
    if (this.userToken.trim().length > 0) {
      this.ls.addToken?.(this.userToken);
      this.tokenLocked = true;
    }
  }

  unlockToken(): void {
    this.tokenLocked = false;
  }
  addImage(event: any) {
    console.log(event);
    this.image = event.files[0];
    console.log(this.image);
  }

  sendForm() {
    const formData = new FormData();
    formData.append("date", formatDate(this.date, "yyyy-MM-dd", "en-US"));
    formData.append("length", this.length);
    formData.append("height", this.height);
    formData.append("bikeLength", this.bikeLength);
    formData.append("bikeHeight", this.bikeHeight);
    formData.append("image", this.image);
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    this.um.postData(formData).subscribe((data) => {
      console.log(data);
      this.ref.close();
    });
  }

  cancel() {
    this.ref.close();
  }
}
