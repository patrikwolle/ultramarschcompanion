import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  url: string;
  date: Date;
  confirmed: boolean;
  length?: number;
  height?: number;
  bikeLength?: number;
  bikeHeight?: number;
  noteCount?: number;
}

@Injectable({ providedIn: "root" })
export class UploadedFilesService {
  private readonly _files$ = new BehaviorSubject<UploadedFile[]>([]);
  readonly files$ = this._files$.asObservable();

  get snapshot(): UploadedFile[] {
    return this._files$.value;
  }

  seed(files: UploadedFile[]) {
    this._files$.next(files);
  }

  remove(id: string) {
    const next = this.snapshot.filter((f) => f.id !== id);
    this._files$.next(next);
  }
}
