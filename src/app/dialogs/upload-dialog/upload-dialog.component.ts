import { Component } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {formatDate} from '@angular/common';
import {UmServiceService} from '../../services/um-service.service';

@Component({
  selector: 'app-upload-dialog',
  standalone: false,
  templateUrl: './upload-dialog.component.html',
  styleUrl: './upload-dialog.component.scss'
})
export class UploadDialogComponent {

  date: Date = new Date();
  length: string = ''
  height: string = ''
  bikeLength: string = ''
  bikeHeight: string = ''
  image: any;

  constructor(
    private ref: DynamicDialogRef,
    private um: UmServiceService
  ) { }

  addImage(event: any) {
    console.log(event)
    this.image = event.files[0];
    console.log(this.image);
  }

  sendForm() {
    const formData = new FormData();
    formData.append('date', formatDate(this.date, 'yyyy-MM-dd', 'en-US'));
    formData.append('length', this.length);
    formData.append('height', this.height);
    formData.append('bikeLength', this.bikeLength);
    formData.append('bikeHeight', this.bikeHeight);
    formData.append('image', this.image);
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    this.um.postData(formData).subscribe(data => {
      console.log(data);
      this.ref.close();
    })

  }

  cancel() {
    this.ref.close();
  }

}
