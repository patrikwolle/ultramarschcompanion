import { Component } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {



  userToken: string = '';

  constructor(
    private ls: LocalStorageService
  ) {
    this.userToken = ls.getToken();
  }



  saveSettings():void {
    this.ls.addToken(this.userToken);
  }


}
