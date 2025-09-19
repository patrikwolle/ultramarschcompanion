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
  upload: string = "";
  notice: string = "";
  imageFile: File | null = null;
  userToken: string = "";
  tokenLocked = false;
  uploadedImageUrl: string | null = null;
  uploadedFileName: string | null = null;
  uploadedFileSize: number = 0;

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

  onFileSelect(event: any) {
    const file: File | undefined = event?.files?.[0];
    if (!file) return;

    if (this.uploadedImageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.uploadedImageUrl);
    }

    this.imageFile = file;
    this.uploadedImageUrl = URL.createObjectURL(file);
    this.uploadedFileName = file.name;
    this.uploadedFileSize = file.size;
  }

  onServerUpload(event: any) {
    const body = event?.originalEvent?.body;
    const urlFromServer: string | undefined = body?.url;
    const fileNameFromServer: string | undefined = body?.fileName;
    const fileSizeFromServer: number | undefined = body?.size;

    if (urlFromServer) {
      if (this.uploadedImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(this.uploadedImageUrl);
      }
      this.uploadedImageUrl = urlFromServer;
    }
    if (fileNameFromServer) this.uploadedFileName = fileNameFromServer;
    if (typeof fileSizeFromServer === "number")
      this.uploadedFileSize = fileSizeFromServer;
  }

  removeImage() {
    if (this.uploadedImageUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(this.uploadedImageUrl);
    }
    this.uploadedImageUrl = null;
    this.uploadedFileName = null;
    this.uploadedFileSize = 0;
  }

  formatBytes(bytes?: number | null): string {
    const b = typeof bytes === "number" ? bytes : 0;
    if (b === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(b) / Math.log(k));
    const val = b / Math.pow(k, i);
    return `${val.toLocaleString("de-DE", { maximumFractionDigits: 1 })} ${
      sizes[i]
    }`;
  }

  sendForm() {
    const formData = new FormData();
    formData.append("date", formatDate(this.date, "yyyy-MM-dd", "en-US"));
    formData.append("length", this.length);
    formData.append("height", this.height);
    formData.append("bikeLength", this.bikeLength);
    formData.append("bikeHeight", this.bikeHeight);

    if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name); // <-- Binary
    } else {
      console.warn('Kein Bild gewählt.');
      return;
      formData.forEach((value, key) => {
        console.log(key, value);
      });


    }


    this.um.postData(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.ref.close();
      },
      error: (err) => {
        this.ref.close();
      },
      complete: () => {
        this.ref.close();
      },
    });
  }

  cancel() {
    this.ref.close();
  }
}
