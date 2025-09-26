import { Component, OnDestroy, OnInit } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { Observable, Subject } from "rxjs";
import { LocalStorageService } from "../../services/local-storage.service";
import {
  UploadedFile,
  UploadedFilesService,
} from "../../services/uploaded-files.service";

@Component({
  selector: "app-uploaded-files",
  standalone: false,
  templateUrl: "./uploaded-files.component.html",
  styleUrls: ["./uploaded-files.component.scss"],
})
export class UploadedFilesComponent implements OnInit, OnDestroy {
  files$!: Observable<UploadedFile[]>;

  userToken: string = "";
  tokenLocked = false;

  private destroy$ = new Subject<void>();

  constructor(
    private files: UploadedFilesService,
    private ls: LocalStorageService,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.files$ = this.files.files$;

    const saved = this.ls.getToken?.();
    if (saved) {
      this.userToken = saved;
      this.tokenLocked = true;
    }

    if (this.config.data?.files && Array.isArray(this.config.data.files)) {
      const convertedFiles: UploadedFile[] = this.config.data.files.map(
        (message: any, index: number) => {
          const id = message?.id ? String(message.id) : `temp-${index}`;

          const converted: UploadedFile = {
            id,
            name: `Strecke-${message?.date || "unknown"}.jpg`,
            size: Number(message?.size) || 0,
            url: message?.imageUrl || message?.url || "",
            date: message?.date ? new Date(message.date) : new Date(),
            confirmed: message?.confirmed ?? false,
            length: message?.length ?? null,
            height: message?.height ?? null,
            bikeLength: message?.bikeLength ?? null,
            bikeHeight: message?.bikeHeight ?? null,
            noteCount: message?.noteCount ?? 0,
          };

          console.log("url:", converted.url);

          return converted;
        }
      );

      this.files.seed(convertedFiles);
    } else {
      console.log(
        "config.data.files is array:",
        Array.isArray(this.config.data?.files)
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get debugInfo() {
    return {
      hasConfigData: !!this.config?.data,
      filesCount: this.config?.data?.files?.length || 0,
    };
  }

  onTokenInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.userToken = target.value;
  }

  toggleToken(): void {
    if (this.tokenLocked) {
      this.tokenLocked = false;
      return;
    }
    if (this.userToken.trim().length > 0) {
      this.ls.addToken(this.userToken);
      this.tokenLocked = true;
    }
  }

  unlockToken(): void {
    this.tokenLocked = false;
  }

  onDelete(file: UploadedFile) {
    if (file.url?.startsWith("blob:")) {
      URL.revokeObjectURL(file.url);
    }
    this.files.remove(file.id);
  }

  formatBytes(bytes?: number | null): string {
    const b = typeof bytes === "number" ? bytes : 0;
    if (b === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(b) / Math.log(k));
    const val = b / Math.pow(k, i);
    return `${val.toLocaleString("de-DE", { maximumFractionDigits: 1 })} ${
      sizes[i]
    }`;
  }
}
